#!/bin/bash

# 更新宠物图片数据并部署网站

cd "$HOME/Documents/service/bloodzSpace"

echo "🔄 正在更新图片数据..."
node .scripts-backup/generate-pet-images.js

echo ""
echo "🚀 正在部署网站..."
npx hexo clean && npx hexo generate && npx hexo deploy

echo ""
echo "✅ 完成！"
