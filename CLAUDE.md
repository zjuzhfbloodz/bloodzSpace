# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Hexo + NexT theme** personal blog repository (`bloodzSpace`). It hosts multiple content domains:
- Blog posts (`source/_posts`)
- Ideas section (`source/_posts` with `ideas` category, generated at `/ideas`)
- Pet gallery (`source/pets`)
- Stock watch page (`source/stock`)

## Common Commands

```bash
npm run server    # Local preview at localhost:4000
npm run build     # Generate static site to public/
npm run clean     # Clean generated files and cache
npm run deploy    # Deploy to GitHub Pages (git@github.com:zjuzhfbloodz/zjuzhfbloodz.github.io)
```

## Architecture

- **`source/`**: Content source (only source of truth)
- **`public/`**: Build output (generated, gitignored)
- **`themes/next/`**: NexT theme configuration
- **`_config.yml`**: Hexo main config (site URL, deployment)

### Key Configuration

- `index_generator.path`: `blog` - articles are listed at `/blog`, not root `/`
- `theme`: `next`
- Deployment: GitHub Pages via `hexo-deployer-git`

## Custom Scripts

| Script | Purpose |
|--------|---------|
| `scripts/ideas-generator.js` | Custom Hexo generator that filters `ideas` category from homepage and generates separate `/ideas` page |

## Data Flow

1. Write Markdown to `source/_posts/*.md`
2. `npm run build` → Hexo renders to `public/`
3. `npm run deploy` → Deploys to GitHub Pages via `.deploy_git/`

## Known Notes

- `public/`, `.deploy_git/`, `db.json` are gitignored
- Site URL: https://zjuzhfbloodz.github.io
- Deployment requires SSH key access to the GitHub repository
