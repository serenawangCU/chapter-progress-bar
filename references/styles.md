# 进度条风格对照表 · v2.0

## 6 种风格一览

| # | 风格名 | 文件 | Composition ID | 需要素材 |
|---|--------|------|----------------|----------|
| 1 | **Chapter（默认）** | 见下方布局表 | 见下方布局表 | 无 |
| 2 | Dash | `DashProgressBar.tsx` | `DashProgressBar` | 无 |
| 3 | Minimal | `MinimalProgressBar.tsx` | `MinimalProgressBar` | 无 |
| 4 | Text Highlight | `TextHighlightProgressBar.tsx` | `TextHighlightProgressBar` | 无 |
| 5 | Customize | `KyomiProgressBar.tsx` | `KyomiProgressBar` | **用户 PNG** |
| 6 | Crab | `CrabProgressBar.tsx` | `CrabProgressBar` | 内置 SVG（可替换） |

预览图见 [`previews/`](../previews/)（均截取于 **3:00** 时刻）。

---

## Chapter 布局选项

Chapter 是唯一的 **6 种风格之一**，同时支持用户自定义位置与比例：

| 位置 | 比例 | 文件 | Composition ID | Root 尺寸 |
|------|------|------|----------------|-----------|
| 顶部（默认） | 横屏 16:9 | `ChapterProgressBar.tsx` | `ChapterProgressBar` | 1920×1080 |
| 底部 | 横屏 16:9 | `ChapterProgressBarBottom.tsx` | `ChapterProgressBarBottom` | 1920×1080 |
| 顶部 | 竖屏 9:16 | `ChapterProgressBarPortrait.tsx` | `ChapterProgressBarPortrait` | 1080×1920 |

> `ChapterProgressBarBottom` 与 `ChapterProgressBarPortrait` 是 Chapter 的**布局变体**，不是独立风格。

其余 5 种风格默认为顶部横屏 16:9。

---

## 风格说明

### Chapter（默认米色）

- 分段填充 + 章节名，支持 `label` + `sub` 两行
- 默认色：`filled #C09070` · `unfilled #EDE4D4`
- 可定制：顶部/底部、横屏/竖屏（见上表）

### Dash

- 每段上方一条圆角破折号，下方章节名
- 文字颜色随播放进度变化（已播/当前 vs 未播）

### Minimal

- 单条 6px 细线 + 章节节点圆点
- **无章节文字**，最简洁

### Text Highlight

- 无实体条，仅章节名 + `|` 分隔符
- 已走过的时间点文字高亮

### Customize

- 与 Chapter 相同的米色分段条
- 用户上传 PNG 头像沿填充边缘移动
- 组件文件：`KyomiProgressBar.tsx`

### Crab

- 粉色分段条（`#E8738A` / `#F5C0CC`）
- 内置 `MiniCrab` SVG 沿进度爬行，腿有动画

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

---

## 渲染命令

```bash
npx remotion render <CompositionId> --codec=vp8 out/progress-bar.webm
npx remotion render <CompositionId> --codec=prores --prores-profile=4444 out/progress-bar.mov
```

示例：
```bash
npx remotion render ChapterProgressBar --codec=vp8 out/chapter.webm
npx remotion render DashProgressBar --codec=vp8 out/dash.webm
npx remotion render KyomiProgressBar --codec=vp8 out/customize.webm
```
