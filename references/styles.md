# 进度条风格对照表 · v2.0

## 一览

| # | 风格名 | 文件 | Composition ID | 比例 | 位置 | 需要素材 |
|---|--------|------|----------------|------|------|----------|
| 1 | **Chapter（默认）** | `ChapterProgressBar.tsx` | `ChapterProgressBar` | 16:9 | 顶部 | 无 |
| 2 | Chapter Bottom | `ChapterProgressBarBottom.tsx` | `ChapterProgressBarBottom` | 16:9 | 底部 | 无 |
| 3 | Chapter Portrait | `ChapterProgressBarPortrait.tsx` | `ChapterProgressBarPortrait` | 9:16 | 顶部 | 无 |
| 4 | Dash | `DashProgressBar.tsx` | `DashProgressBar` | 16:9 | 顶部 | 无 |
| 5 | Minimal | `MinimalProgressBar.tsx` | `MinimalProgressBar` | 16:9 | 顶部 | 无 |
| 6 | Text Highlight | `TextHighlightProgressBar.tsx` | `TextHighlightProgressBar` | 16:9 | 顶部 | 无 |
| 7 | Customize | `KyomiProgressBar.tsx` | `KyomiProgressBar` | 16:9 | 顶部 | **用户 PNG** |
| 8 | Crab | `CrabProgressBar.tsx` | `CrabProgressBar` | 16:9 | 顶部 | 内置 SVG（可替换） |

---

## 风格说明

### Chapter 系列（默认米色）

- 分段填充 + 章节名，支持 `label` + `sub` 两行
- 默认色：`filled #C09070` · `unfilled #EDE4D4`
- **ChapterProgressBar**：条在顶部，`BAR_HEIGHT 52`
- **ChapterProgressBarBottom**：条在底部，阴影向上
- **ChapterProgressBarPortrait**：竖屏窄格自适应字号，`BAR_HEIGHT 56`

### Dash

- 每段上方一条圆角破折号，下方章节名
- 文字颜色随播放进度变化（已播/当前 vs 未播）
- `BAR_HEIGHT 120`（含文字区域）

### Minimal

- 单条 6px 细线 + 章节节点圆点
- **无章节文字**，最简洁
- 圆点在章节 `startS` 处变色

### Text Highlight

- 无实体条，仅章节名 + `|` 分隔符
- 已走过的时间点文字高亮为 `activeText`

### Customize

- 与 Chapter 相同的米色分段条
- 用户上传 PNG 头像（默认示例 `assets/kyomi_smile_head_stroke.png`）沿填充边缘移动
- 组件文件：`KyomiProgressBar.tsx`

### Crab

- 粉色分段条（`#E8738A` / `#F5C0CC`）
- 内置 `MiniCrab` SVG 沿进度爬行，腿有动画
- 可改 `COLORS` / `C` 配色，或替换 `MiniCrab` 为用户 SVG/PNG

---

## 章节数据格式（所有风格通用）

```tsx
const TOTAL_DURATION_S = 945;

const chapters = [
  { label: "开场",     sub: "",       startS: 0,   endS: 70  },
  { label: "Demo 1",  sub: "截图复刻", startS: 70,  endS: 102 },
  // ...
];
```

- `label`：主标题（必填）
- `sub`：副标题（可选，无则 `""`）
- `startS` / `endS`：章节起止秒数
- 最后一条的 `endS` 应等于 `TOTAL_DURATION_S`

---

## 渲染命令

将 `<CompositionId>` 替换为上表中的 ID：

```bash
# WebM 透明背景
npx remotion render <CompositionId> --codec=vp8 out/progress-bar.webm

# ProRes 4444 透明背景
npx remotion render <CompositionId> --codec=prores --prores-profile=4444 out/progress-bar.mov
```

示例：
```bash
npx remotion render DashProgressBar --codec=vp8 out/dash-progress.webm
npx remotion render KyomiProgressBar --codec=prores --prores-profile=4444 out/customize-progress.mov
```
