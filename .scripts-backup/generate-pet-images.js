#!/usr/bin/env node
/**
 * 自动扫描宠物图片并生成 HTML 数据
 */

const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../source/images/pets');
const outputFile = path.join(__dirname, '../source/pets/images-data.js');

// 从文件名判断是否找到宠物
function isPetFound(filename) {
    // dog_xxx 表示找到小狗，cat_xxx 表示找到猫咪，pet_xxx 表示监控截图
    return filename.startsWith('dog_') || filename.startsWith('cat_');
}

// 获取所有图片文件
function getAllImages() {
    const images = [];
    const files = fs.readdirSync(imagesDir).filter(f => 
        f.match(/^(pet|dog|cat)_\d{8}_\d{6}\.jpg$/i)
    );
    
    for (const file of files) {
        const match = file.match(/^(\w+)_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})\.jpg$/i);
        if (match) {
            const [_, type, year, month, day, hour, min, sec] = match;
            const dateKey = `${year}-${month}-${day}`;
            const timeStr = `${hour}:${min}`;
            const url = `/images/pets/${file}`;
            
            images.push({
                date: dateKey,
                time: timeStr,
                img: url,
                type: type.toLowerCase(),
                found: isPetFound(file),
                filename: file
            });
        }
    }
    
    return images.sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return b.time.localeCompare(a.time);
    });
}

// 按日期分组
function groupByDate(images) {
    const groups = {};
    for (const img of images) {
        if (!groups[img.date]) {
            groups[img.date] = [];
        }
        groups[img.date].push({
            date: img.date,
            time: img.time,
            img: img.img,
            type: img.type,
            found: img.found
        });
    }
    return groups;
}

// 生成 JavaScript 数据文件
function generateJSData() {
    const images = getAllImages();
    const groups = groupByDate(images);
    const dates = Object.keys(groups).sort().reverse();
    
    const jsContent = `// 自动生成 - 不要手动修改
// 最后更新: ${new Date().toLocaleString('zh-CN')}
// 运行: node scripts/generate-pet-images.js 更新数据

const petImagesData = {
    dates: ${JSON.stringify(dates, null, 2)},
    images: ${JSON.stringify(groups, null, 2)},
    stats: {
        totalImages: ${images.length},
        totalDays: ${dates.length},
        foundCount: ${images.filter(i => i.found).length},
        notFoundCount: ${images.filter(i => !i.found).length},
        dogCount: ${images.filter(i => i.type === 'dog').length},
        catCount: ${images.filter(i => i.type === 'cat').length}
    },
    generatedAt: new Date().toISOString()
};

module.exports = petImagesData;
`;
    
    fs.writeFileSync(outputFile, jsContent);
    console.log(`✅ 生成了 ${images.length} 张图片数据`);
    console.log(`📅 日期范围: ${dates[0]} ~ ${dates[dates.length-1]}`);
    console.log(`🐕 找到小狗: ${images.filter(i => i.type === 'dog').length} 次`);
    console.log(`🐱 找到猫咪: ${images.filter(i => i.type === 'cat').length} 次`);
    console.log(`📁 数据文件: ${outputFile}`);
}

// 主入口
generateJSData();
