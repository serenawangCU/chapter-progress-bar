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
        ├── ChapterProgressBar.tsx          ← Chapter 顶部横屏（布局参考基准）
        ├── ChapterProgressBarBottom.tsx    ← 改「条放底部」时参考
        ├── ChapterProgressBarPortrait.tsx  ← 改「竖屏 9:16」时参考
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

| 风格 | BAR_HEIGHT | 默认配色 | 布局 |
|------|------------|----------|------|
| Chapter | 52 | 米色 | 有 3 个变体文件 |
| Dash | 120 | 米色 | 参考 Chapter 改底部/竖屏 |
| Minimal | 120 | 米色 | 参考 Chapter 改底部/竖屏 |
| Text Highlight | 80 | 米色 | 参考 Chapter 改底部/竖屏 |
| Customize | 52 | 米色 | 参考 Chapter 改底部/竖屏 |
| Crab | 60 | 粉色 | 参考 Chapter 改底部/竖屏 |

---

## 渲染输出

```bash
npx remotion render <CompositionId> --codec=vp8 out/progress-bar.webm
npx remotion render <CompositionId> --codec=prores --prores-profile=4444 out/progress-bar.mov
```

Composition ID 见 [styles.md](./styles.md)。
