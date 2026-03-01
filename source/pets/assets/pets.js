    const state = { type: 'all', includeArchive: false, data: null, startDate: null, endDate: null };
    const DISPLAY_TYPES = ['person', 'cat', 'dog', 'pet'];

    function formatDate(iso) {
      const d = new Date(iso);
      const w = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return `${d.getMonth() + 1}月${d.getDate()}日 ${w[d.getDay()]}`;
    }

    function btn(text, onClick, active) {
      const b = document.createElement('button');
      b.className = `btn ${active ? 'active' : ''}`;
      b.textContent = text;
      b.onclick = onClick;
      return b;
    }

    function renderSummary() {
      const all = Object.values(state.data.images).flat();
      const found = all.filter(x => x.found);
      const archived = all.length - found.length;
      const persons = found.filter(x => x.type === 'person').length;
      const dogs = found.filter(x => x.type === 'dog').length;
      const cats = found.filter(x => x.type === 'cat').length;
      const pets = found.filter(x => x.type === 'pet').length;

      document.getElementById('summary').innerHTML = `
        <div class="chip">识别总图<b>${all.length}</b></div>
        <div class="chip" style="color:var(--ok);">展示中（人/猫/狗）<b>${found.length}</b></div>
        <div class="chip" style="color:var(--warn);">Archive（其它）<b>${archived}</b></div>
        <div class="chip">🧍 人物<b>${persons}</b></div>
        <div class="chip">🐕 狗狗<b>${dogs}</b></div>
        <div class="chip">🐱 猫咪<b>${cats}</b></div>
        <div class="chip">🐾 宠物<b>${pets}</b></div>
      `;
    }

    function initRangeFilters() {
      const dates = [...state.data.dates].sort();
      state.startDate = dates[0] || null;
      state.endDate = dates[dates.length - 1] || null;
      const s = document.getElementById('startDate');
      const e = document.getElementById('endDate');
      s.value = state.startDate || '';
      e.value = state.endDate || '';
      document.getElementById('applyRangeBtn').onclick = () => {
        state.startDate = s.value || state.startDate;
        state.endDate = e.value || state.endDate;
        renderDay();
      };
    }

    function petTypeLabel(type) {
      if (type === 'person') return '人物';
      if (type === 'dog') return '狗狗';
      if (type === 'cat') return '猫咪';
      if (type === 'pet') return '宠物';
      return '其它';
    }

    function renderTypeButtons() {
      const wrap = document.getElementById('typeButtons');
      wrap.innerHTML = '';
      const opts = [
        ['all', '全部'],
        ['person', '人物'],
        ['cat', '猫咪'],
        ['dog', '狗狗'],
        ['pet', '宠物']
      ];
      opts.forEach(([key, label]) => {
        wrap.appendChild(btn(label, () => {
          state.type = key;
          renderTypeButtons();
          renderDay();
        }, state.type === key));
      });

      wrap.appendChild(btn(state.includeArchive ? '含 Archive' : '仅识别图', () => {
        state.includeArchive = !state.includeArchive;
        renderTypeButtons();
        renderDay();
      }, state.includeArchive));
    }

    function renderDay() {
      const day = document.getElementById('day');
      const empty = document.getElementById('empty');
      const start = state.startDate || '0000-01-01';
      const end = state.endDate || '9999-12-31';
      const inRange = Object.entries(state.data.images)
        .filter(([d]) => d >= start && d <= end)
        .flatMap(([, arr]) => arr);

      const list = inRange
        .filter(x => state.includeArchive ? true : (x.found && DISPLAY_TYPES.includes(x.type)))
        .filter(x => state.type === 'all' ? true : x.type === state.type)
        .sort((a,b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

      if (!list.length && !state.includeArchive && inRange.length) {
        state.includeArchive = true;
        renderTypeButtons();
        renderDay();
        return;
      }

      if (!list.length) {
        day.style.display = 'none';
        empty.style.display = 'block';
        empty.textContent = '所选筛选条件下没有图片。';
        return;
      }

      day.style.display = 'block';
      empty.style.display = 'none';
      const typeLabel = state.type === 'all' ? '全部' : petTypeLabel(state.type);
      day.innerHTML = `
        <h2>${start} ~ ${end} · ${typeLabel} · 共 ${list.length} 张</h2>
        <div class="gallery">
          ${list.map(x => `
            <article class="card" onclick="openModal('${x.img}')">
              <img src="${x.img}" alt="${x.date} ${x.time}" loading="lazy" />
              <div class="meta">
                <div class="time">${x.date} ${x.time}</div>
                <span class="tag ${x.type}">${petTypeLabel(x.type)}</span>
              </div>
            </article>
          `).join('')}
        </div>
      `;
    }

    function openModal(src) {
      document.getElementById('modalImg').src = src;
      document.getElementById('modal').classList.add('active');
    }

    function closeModal() {
      document.getElementById('modal').classList.remove('active');
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    (function init() {
      if (typeof petImagesData === 'undefined') {
        document.getElementById('empty').style.display = 'block';
        document.getElementById('empty').textContent = '数据加载失败';
        return;
      }
      state.data = petImagesData;
      renderSummary();
      initRangeFilters();
      renderTypeButtons();
      renderDay();
    })();
