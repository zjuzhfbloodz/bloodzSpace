# bloodzSpace（Hexo 博客）

面向后续接手模型的快速说明，目标是 5 分钟内建立完整心智模型。

## 1. 项目定位

- 这是一个基于 **Hexo + NexT 主题** 的个人博客仓库。
- 主要用户是站点 owner（Bloodz）及其自动化发布链路（例如 IdeaPusher 网关）。
- 仓库同时承载多个内容域：
  - 常规博客文章（`source/_posts`）
  - Ideas 专栏（按分类 `ideas` 聚合）
  - 宠物相册页（`source/pets`）
  - 股票看盘页面（`source/stock`）

## 2. 目录结构导览

- `source/`：站点源文件（核心）
- `source/_posts/`：Markdown 文章源，发布入口
- `source/_data/next.yml`：NexT 菜单等主题配置（home/ideas/pets/blog）
- `source/pets/`：宠物相册页面与数据脚本
- `source/stock/`：A 股看盘静态页面
- `scripts/ideas-generator.js`：自定义生成器，把 `ideas` 分类从首页流中剥离并生成 `/ideas`
- `scripts/images-data.js`：宠物图片数据（当前是静态数据文件）
- `tools/review_pets_full.py`：YOLO 全量复核并生成 `source/pets/images-data.js`
- `public/`：Hexo 生成结果目录（构建产物）
- `.deploy_git/`：`hexo-deployer-git` 的部署工作目录（目标仓库工作树）
- `_config.yml`：Hexo 主配置（站点 URL、路由、部署目标）
- `package.json`：可用 npm 命令（`clean/build/server/deploy`）

## 3. 运行 / 构建方式（本地）

前置：Node.js + npm 可用。

```bash
cd /Users/bloodz/Documents/macmini/service/bloodzSpace
npm install
```

本地预览：

```bash
npm run server
```

静态构建：

```bash
npm run clean
npm run build
```

发布（推送到 GitHub Pages 仓库）：

```bash
npm run deploy
```

当前 `_config.yml` 部署目标：
- repo: `git@github.com:zjuzhfbloodz/zjuzhfbloodz.github.io.git`
- branch: `main`

## 4. 关键流程（数据流 / 脚本 / 发布链路）

### 4.1 内容发布主链路

1. 写入或更新 `source/_posts/*.md`（人工或外部网关写入）。
2. `npm run build` -> Hexo 渲染到 `public/`。
3. `npm run deploy` -> `hexo-deployer-git` 同步 `public/` 到 `.deploy_git/` 并推送远端。

### 4.2 `source` / `public` / `.deploy_git` 的关系

- `source/`：唯一可信源（source of truth）。
- `public/`：可随时重建的构建产物，已在 `.gitignore` 忽略。
- `.deploy_git/`：部署插件的临时 Git 工作目录，已忽略，不应手工长期维护。

### 4.3 Ideas 分流逻辑

- `scripts/ideas-generator.js` 重载 index 生成策略：
  - 首页（`/blog`）过滤掉 `ideas` 分类文章
  - `ideas` 分类单独生成 `/ideas`
- 因此“普通博客”和“想法流”是并行入口，不是同一 feed。

### 4.4 宠物识别链路

1. 图片放在 `source/images/pets`。
2. `tools/review_pets_full.py` 调 YOLO（`yolov8n.pt`）识别人/猫/狗。
3. 命中目标的图片进入可展示数据，未命中的移动到 `archive`。
4. 生成 `source/pets/images-data.js` 供前端页面渲染。

一键执行：

```bash
npm run pets:review
```

### 4.5 评论系统

- 当前启用 NexT 评论 tabs：
  - Disqus（匿名评论，`shortname: bloodz`）
  - Gitalk（GitHub 评论）
- 文章 front-matter 需保留 `comments: true`。
- 评论配置集中在 `source/_data/next.yml`。

## 5. 当前状态与已知坑

- 依赖体量较大：`node_modules` 已存在，需注意 Node 版本兼容性。
- `public/`、`.deploy_git/`、`db.json` 均被 `.gitignore` 忽略：
  - 本地构建/部署状态不会自动进入主仓库提交。
- 部署依赖 SSH：`git@github.com` 方式要求当前机器 SSH key 可推送。
- `.deploy_git.bak.20260223193704/` 存在历史备份目录，容易引起“哪个是当前部署树”的混淆。
- `scripts/images-data.js` 是历史数据文件，当前主链路脚本为 `tools/review_pets_full.py`。
- `index_generator.path` 是 `blog`，所以站点文章主列表不在根路径 `/`，后续接手时容易误判。

## 6. 建议下一步（可执行）

1. 增加 `README` 中的“发布前检查清单”（SSH、`npm run build`、目标分支）并在 CI 中自动验证。
2. 给宠物识别链路补一个一键脚本（例如 `npm run pets:refresh` 调 Python），统一入口。
3. 清理或归档 `.deploy_git.bak.*`，减少部署目录认知成本。
4. 为 `scripts/ideas-generator.js` 增加最小回归说明（分类过滤与分页行为）。
5. 梳理 `source` 中业务页面（`pets/stock`）的维护边界，避免“页面代码散落”继续扩大。
