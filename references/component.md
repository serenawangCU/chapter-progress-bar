# ChapterProgressBar — 组件参考

## 文件位置

```
Skills/Chapter Progress Bar/
├── SKILL.md
├── component.md          ← 本文件
└── src/
    ├── ChapterProgressBar.tsx   ← 主组件（在这里编辑）
    ├── Root.tsx                 ← 注册 Composition + 设置总帧数
    └── package.json
```

**可运行的完整项目**（含 node_modules）：存放在你本地的任意目录，`cd` 进去后运行：
```bash
npm run dev
```

---

## 关键常量（每次新视频都要改）

| 常量 | 文件 | 说明 |
|------|------|------|
| `TOTAL_DURATION_S` | ChapterProgressBar.tsx | 视频总秒数（分×60+秒） |
| `chapters[]` | ChapterProgressBar.tsx | 章节名称 + 开始/结束秒数 |
| `durationInFrames` | Root.tsx | 总秒数 × 30 |

## 可调样式参数

| 参数 | 当前值 | 说明 |
|------|--------|------|
| `BAR_HEIGHT` | `52` | 进度条高度（px） |
| `opacity` | `0.82` | 透明度（0–1） |
| `fontSize` | `20` | 章节文字大小 |
| `COLORS.filled` | `#C09070` | 已播放颜色（米色系暖棕） |
| `COLORS.unfilled` | `#EDE4D4` | 未播放颜色（浅米色） |

---

## 渲染输出

```bash
# WebM 透明背景（通用）
npx remotion render ChapterProgressBar --codec=vp8 out/progress-bar.webm

# ProRes 4444 透明背景（Final Cut / DaVinci）
npx remotion render ChapterProgressBar --codec=prores --prores-profile=4444 out/progress-bar.mov
```
