# 组件参考 · v2.0

## 文件位置

```
chapter-progress-bar/
├── SKILL.md
├── references/
│   ├── component.md          ← 本文件
│   └── styles.md             ← 8 种风格对照表
└── src/
    ├── Root.tsx              ← 注册 Composition + 总帧数 + 透明通道 metadata
    └── progress-bars/
        ├── ChapterProgressBar.tsx
        ├── ChapterProgressBarBottom.tsx
        ├── ChapterProgressBarPortrait.tsx
        ├── DashProgressBar.tsx
        ├── MinimalProgressBar.tsx
        ├── TextHighlightProgressBar.tsx
        ├── KyomiProgressBar.tsx       ← Customize 风格
        ├── CrabProgressBar.tsx
        └── assets/
            └── kyomi_smile_head_stroke.png   ← Customize 默认示例头像
```

**可运行的完整项目**（含 node_modules）：在用户本地任意目录 `cd` 进去后运行：

```bash
npm run dev
```

---

## 每次新视频都要改

| 常量 / 字段 | 文件 | 说明 |
|-------------|------|------|
| `TOTAL_DURATION_S` | 选定的 `*ProgressBar.tsx` | 视频总秒数 |
| `chapters[]` | 同上 | `label` / `sub` / `startS` / `endS` |
| `durationInFrames` | `Root.tsx` | `TOTAL_DURATION_S × fps`（通常 × 30） |
| `width` / `height` | `Root.tsx` | 横屏 1920×1080 / 竖屏 1080×1920 |
| Composition `id` | `Root.tsx` | 与 [styles.md](./styles.md) 中的 ID 一致 |

---

## 各风格关键参数

| 风格 | BAR_HEIGHT | 默认配色 | 特殊常量 |
|------|------------|----------|----------|
| Chapter | 52 | 米色 | `BAR_OPACITY 0.82` |
| Chapter Bottom | 52 | 米色 | 条在 `bottom: 0` |
| Chapter Portrait | 56 | 米色 | 字号随格宽自适应 |
| Dash | 120 | 米色 | 破折号高 6px |
| Minimal | 120 | 米色 | 线高 6px，圆点 16px |
| Text Highlight | 80 | 米色 | `fontSize 24` |
| Customize | 52 | 米色 | `HEAD_H 46`，PNG import |
| Crab | 60 | 粉色 | `CRAB_W 90`，`MiniCrab` SVG |

---

## Root.tsx 透明通道

本仓库 Root 使用 `calculateMetadata` 预设 ProRes 4444 透明输出：

```tsx
const alphaMeta: CalculateMetadataFunction<Record<string, unknown>> = async () => ({
  defaultCodec: "prores",
  defaultVideoImageFormat: "png",
  defaultPixelFormat: "yuva444p10le",
  defaultProResProfile: "4444",
});
```

---

## 渲染输出

```bash
# WebM 透明背景（通用）
npx remotion render <CompositionId> --codec=vp8 out/progress-bar.webm

# ProRes 4444 透明背景（Final Cut / DaVinci）
npx remotion render <CompositionId> --codec=prores --prores-profile=4444 out/progress-bar.mov
```

Composition ID 列表见 [styles.md](./styles.md)。
