#!/usr/bin/env python3
import json
import re
import shutil
from collections import defaultdict
from datetime import datetime
from pathlib import Path

from ultralytics import YOLO

ROOT = Path('source/images/pets')
ARCHIVE_NAME = 'archive'
OUT = Path('source/pets/images-data.js')
EXTS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.heic', '.heif'}
TARGET_CLASS_IDS = {0: 'person', 15: 'cat', 16: 'dog'}
CONF_THRES = 0.25


def parse_datetime_from_name(name: str):
    # Support both "20260224_130032_xxx" and "20260224-130032-xxx" styles.
    m = re.search(r'(\d{8})[_-](\d{6})', name)
    if not m:
        return None
    raw = f"{m.group(1)}{m.group(2)}"
    try:
        return datetime.strptime(raw, '%Y%m%d%H%M%S')
    except ValueError:
        return None


def public_img_path(full_path: Path) -> str:
    rel = full_path.relative_to(Path('source'))
    return '/' + rel.as_posix()


def detect_target_type(result):
    if result.boxes is None or len(result.boxes) == 0:
        return False, None
    best = None
    for i in range(len(result.boxes)):
        cls_id = int(result.boxes.cls[i].item())
        conf = float(result.boxes.conf[i].item())
        if cls_id not in TARGET_CLASS_IDS or conf < CONF_THRES:
            continue
        if best is None or conf > best[0]:
            best = (conf, TARGET_CLASS_IDS[cls_id])
    if best is None:
        return False, None
    return True, best[1]


def normalize_item(path: Path, found: bool, typ: str) -> dict:
    dt = parse_datetime_from_name(path.name)
    if dt is None:
        dt = datetime.fromtimestamp(path.stat().st_mtime)
    return {
        'date': dt.strftime('%Y-%m-%d'),
        'time': dt.strftime('%H:%M'),
        'sort_dt': dt,
        'img': public_img_path(path),
        'type': typ,
        'found': found,
    }


def ensure_unique(dest: Path) -> Path:
    if not dest.exists():
        return dest
    stem = dest.stem
    suffix = dest.suffix
    idx = 1
    while True:
        alt = dest.with_name(f"{stem}__dup{idx}{suffix}")
        if not alt.exists():
            return alt
        idx += 1


def move_with_structure(path: Path, keep: bool) -> Path:
    rel = path.relative_to(ROOT)
    parts = rel.parts
    in_archive = len(parts) > 0 and parts[0] == ARCHIVE_NAME

    if keep:
        target_rel = Path(*parts[1:]) if in_archive else rel
    else:
        target_rel = rel if in_archive else Path(ARCHIVE_NAME) / rel

    dest = ROOT / target_rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest = ensure_unique(dest)
    if dest.resolve() == path.resolve():
        return path
    shutil.move(str(path), str(dest))
    return dest


def to_js(data: dict) -> str:
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    generated = datetime.now().isoformat(timespec='seconds')
    return (
        "// 自动生成 - 不要手动修改\n"
        f"// 最后更新: {generated}\n"
        "// 运行: source .venv-pets/bin/activate && python tools/review_pets_full.py\n\n"
        f"const petImagesData = {payload};\n\n"
        "if (typeof module !== 'undefined') {\n"
        "  module.exports = petImagesData;\n"
        "}\n"
    )


def main():
    all_files = sorted([p for p in ROOT.rglob('*') if p.is_file() and p.suffix.lower() in EXTS])
    if not all_files:
        raise SystemExit('No images found in source/images/pets')

    model = YOLO('yolov8n.pt')
    print(f'Running full review on {len(all_files)} images...')

    results_data = []
    move_to_archive = 0
    move_out_archive = 0
    person_count = 0
    cat_count = 0
    dog_count = 0

    batch_size = 64
    for i in range(0, len(all_files), batch_size):
        chunk = all_files[i:i + batch_size]
        preds = model.predict([str(x) for x in chunk], verbose=False, device='cpu')
        for path, pred in zip(chunk, preds):
            keep, typ = detect_target_type(pred)
            final_path = move_with_structure(path, keep)
            if keep:
                t = typ or 'person'
                if t == 'person':
                    person_count += 1
                elif t == 'cat':
                    cat_count += 1
                elif t == 'dog':
                    dog_count += 1
                if 'archive' in path.relative_to(ROOT).parts:
                    move_out_archive += 1
                results_data.append(normalize_item(final_path, True, t))
            else:
                if 'archive' not in path.relative_to(ROOT).parts:
                    move_to_archive += 1
                results_data.append(normalize_item(final_path, False, 'pet'))
        if (i // batch_size + 1) % 5 == 0:
            print(f"  processed {min(i+batch_size, len(all_files))}/{len(all_files)}")

    grouped = defaultdict(list)
    for item in results_data:
        grouped[item['date']].append({
            'date': item['date'],
            'time': item['time'],
            'img': item['img'],
            'type': item['type'],
            'found': item['found'],
        })

    dates = sorted(grouped.keys(), reverse=True)
    images = {d: sorted(grouped[d], key=lambda x: x['time'], reverse=True) for d in dates}

    total = len(results_data)
    found_count = sum(1 for x in results_data if x['found'])
    data = {
        'dates': dates,
        'images': images,
        'stats': {
            'totalImages': total,
            'totalDays': len(dates),
            'foundCount': found_count,
            'notFoundCount': total - found_count,
            'personCount': person_count,
            'dogCount': dog_count,
            'catCount': cat_count,
            'movedToArchiveCount': move_to_archive,
            'movedOutOfArchiveCount': move_out_archive,
        },
        'generatedAt': datetime.now().isoformat(timespec='seconds'),
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(to_js(data), encoding='utf-8')
    print(json.dumps({
        'total': total,
        'keep': found_count,
        'archive': total - found_count,
        'movedToArchive': move_to_archive,
        'movedOutArchive': move_out_archive,
    }, ensure_ascii=False))


if __name__ == '__main__':
    main()
