# 组件参考 · v2.0

## 文件位置

```
chapter-progress-bar/
├── SKILL.md
├── previews/                 ← 6 种风格预览图（3:00 截图）
├── references/
│   ├── component.md          ← 本文件
│   └── styles.md             ← 6 种风格 + Chapter 布局选项
└── src/
    ├── Root.tsx
    └── progress-bars/
        ├── ChapterProgressBar.tsx          ← Chapter 顶部横屏
        ├── ChapterProgressBarBottom.tsx    ← Chapter 底部横屏
        ├── ChapterProgressBarPortrait.tsx  ← Chapter 顶部竖屏
        ├── DashProgressBar.tsx
        ├── MinimalProgressBar.tsx
        ├── TextHighlightProgressBar.tsx
        ├── KyomiProgressBar.tsx            ← Customize 风格
        ├── CrabProgressBar.tsx
        └── assets/
            └── kyomi_smile_head_stroke.png
```

---

## 每次新视频都要改

| 常量 / 字段 | 文件 | 说明 |
|-------------|------|------|
| `TOTAL_DURATION_S` | 选定的 `*ProgressBar.tsx` | 视频总秒数 |
| `chapters[]` | 同上 | `label` / `sub` / `startS` / `endS` |
| `durationInFrames` | `Root.tsx` | `TOTAL_DURATION_S × fps`（通常 × 30） |
| `width` / `height` | `Root.tsx` | 横屏 1920×1080 / 竖屏 1080×1920 |
| Composition `id` | `Root.tsx` | 见 [styles.md](./styles.md) |

---

## 各风格关键参数

| 风格 | BAR_HEIGHT | 默认配色 | 备注 |
|------|------------|----------|------|
| Chapter | 52 | 米色 | 可 top/bottom、16:9/9:16 |
| Dash | 120 | 米色 | 破折号高 6px |
| Minimal | 120 | 米色 | 线高 6px，圆点 16px |
| Text Highlight | 80 | 米色 | `fontSize 24` |
| Customize | 52 | 米色 | PNG import，`HEAD_H 46` |
| Crab | 60 | 粉色 | `MiniCrab` SVG |

---

## 渲染输出

```bash
npx remotion render <CompositionId> --codec=vp8 out/progress-bar.webm
npx remotion render <CompositionId> --codec=prores --prores-profile=4444 out/progress-bar.mov
```

Composition ID 见 [styles.md](./styles.md)。
