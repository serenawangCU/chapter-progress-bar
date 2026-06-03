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

预览图见 [`previews/`](../previews/)（均截取于 **3:00** 时刻，默认顶部横屏）。

---

## 位置 & 比例（全部 6 种风格均适用）

| 选项 | 默认 |
|------|------|
| 位置 | 顶部 |
| 比例 | 横屏 16:9 |

### Chapter — 现成布局组件

| 位置 | 比例 | 文件 | Composition ID | Root 尺寸 |
|------|------|------|----------------|-----------|
| 顶部（默认） | 横屏 16:9 | `ChapterProgressBar.tsx` | `ChapterProgressBar` | 1920×1080 |
| 底部 | 横屏 16:9 | `ChapterProgressBarBottom.tsx` | `ChapterProgressBarBottom` | 1920×1080 |
| 顶部 | 竖屏 9:16 | `ChapterProgressBarPortrait.tsx` | `ChapterProgressBarPortrait` | 1080×1920 |

### 其他 5 种风格 — 参考 Chapter 改法

仓库未预置底部/竖屏变体，但**全部风格都支持**自定义位置与比例：

| 需求 | 参考文件 | 改什么 |
|------|----------|--------|
| 竖屏 9:16 | `ChapterProgressBarPortrait.tsx` | Root `1080×1920`；窄格自适应字号 |
| 条放底部 | `ChapterProgressBarBottom.tsx` | 容器 `bottom: 0`；阴影方向翻转 |
| 底部 + 竖屏 | 以上两个 | 同时应用 |

---

## 风格说明

### Chapter（默认米色）

- 分段填充 + 章节名，支持 `label` + `sub` 两行
- 默认色：`filled #C09070` · `unfilled #EDE4D4`

### Dash

- 每段上方一条圆角破折号，下方章节名
- 文字颜色随播放进度变化

### Minimal

- 单条 6px 细线 + 章节节点圆点，无章节文字

### Text Highlight

- 无实体条，仅章节名 + `|` 分隔符

### Customize

- 米色分段条 + 用户 PNG 头像沿填充边缘移动

### Crab

- 粉色分段条 + 内置 `MiniCrab` SVG 沿进度爬行

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
