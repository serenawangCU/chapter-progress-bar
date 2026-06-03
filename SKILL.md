---
name: chapter-progress-bar
description: >
  根据视频字幕文件（.srt）或用户直接提供的时间戳，生成章节进度条 overlay 视频（透明背景），
  支持 8 种风格：默认米色 Chapter、底部/竖屏变体、Dash、Minimal、TextHighlight、
  Customize（自定义 PNG 头像）、Crab（螃蟹 SVG 动画）。
  Use when the user wants to create a chapter/section progress bar overlay for a video,
  choose among multiple visual styles, or customize with their own image asset.
metadata:
  author: serena
  version: "2.0"
---

## References

- [styles.md](./references/styles.md) — 8 种风格对照表、Composition ID、适用场景
- [component.md](./references/component.md) — 关键常量、文件结构、渲染命令
- [src/progress-bars/](./src/progress-bars/) — 全部组件源码（直接复制修改）
- [src/Root.tsx](./src/Root.tsx) — Composition 注册示例

# Chapter Progress Bar v2.0

根据 `.srt` 字幕或时间戳，生成视频章节进度条 overlay。v2.0 支持 **8 种风格**，默认仍为米色 `ChapterProgressBar`。

## 第一步：判断输入模式

**模式 A — 用户提供 `.srt` 字幕文件**

读取文件，找出：
1. 视频总时长（最后一条字幕的结束时间）
2. 内容结构上的自然段落（话题转换点）
3. 向用户建议章节划分，**确认后再继续**

**模式 B — 用户直接给出时间戳和章节名**

例如：
```
0:00 开始
2:07 文件夹结构
4:46 自动化输入流
```

直接使用，跳过字幕分析，只需额外确认视频总时长。

时间戳换算公式：`总秒数 = 分钟 × 60 + 秒`

---

## 第二步：选择进度条风格

**若用户未指定风格，默认使用 `ChapterProgressBar`（米色，顶部）。**

向用户展示可选风格（可用简短描述 + 让用户选编号或名称）：

| 风格 | 组件 | Composition ID | 说明 |
|------|------|----------------|------|
| **Chapter（默认）** | `ChapterProgressBar` | `ChapterProgressBar` | 米色分段条，顶部，支持主标题 + 副标题 |
| Chapter Bottom | `ChapterProgressBarBottom` | `ChapterProgressBarBottom` | 同上，条在**底部** |
| Chapter Portrait | `ChapterProgressBarPortrait` | `ChapterProgressBarPortrait` | 同上，**竖屏 9:16**，字号自适应 |
| Dash | `DashProgressBar` | `DashProgressBar` | 分段破折号 + 下方章节名 |
| Minimal | `MinimalProgressBar` | `MinimalProgressBar` | 极简单线 + 节点圆点，无文字 |
| Text Highlight | `TextHighlightProgressBar` | `TextHighlightProgressBar` | 纯文字高亮，`\|` 分隔 |
| Customize | `KyomiProgressBar` | `KyomiProgressBar` | 米色条 + **用户上传 PNG 头像**沿进度移动 |
| Crab | `CrabProgressBar` | `CrabProgressBar` | 粉色条 + **内置螃蟹 SVG** 沿进度爬行 |

> 风格源码均在 [`src/progress-bars/`](./src/progress-bars/)，选定后只修改对应文件，不要混写多种风格到一个组件里。

---

## 第三步：确认通用参数

两种输入模式都需要确认：

- **视频比例**
  - 16:9 横屏（YouTube 默认）→ 除 Portrait 外均可
  - 9:16 竖屏（Shorts / Reels / TikTok）→ 使用 `ChapterProgressBarPortrait`，Root 设为 `1080×1920`
- **进度条位置**（仅 Chapter 系列）：顶部（默认）或底部（`ChapterProgressBarBottom`）
- **配色**：默认米色（`#C09070` / `#EDE4D4`）；Crab 默认粉色；可按风格改 `COLORS` 对象
- **章节数据结构**：所有组件统一使用

```tsx
const chapters = [
  { label: "章节名", sub: "副标题（可选，留空字符串）", startS: 0, endS: 127 },
  // ...
];
const TOTAL_DURATION_S = 945; // 视频总秒数
```

> [!IMPORTANT]
> **此 skill 的最终 output 是启动预览 server（`npm run dev`），不是渲染视频。**
> 生成代码后直接跑 server，让用户在浏览器里检查效果，由用户自己决定何时渲染。
> 禁止主动执行任何 `remotion render` 命令。

---

## 第四步：定制素材（按需）

### Customize — 用户上传 PNG 头像

1. 请用户提供 PNG（透明背景最佳）
2. 保存到 `src/progress-bars/assets/`，例如 `my-avatar.png`
3. 在 `KyomiProgressBar.tsx` 顶部修改 import：

```tsx
import myAvatar from "./assets/my-avatar.png";
// 将 Img 的 src 改为 myAvatar
```

4. 可按图片比例调整 `HEAD_H` / `HEAD_W`

### Crab — 内置 SVG，可选替换

默认使用组件内 `MiniCrab` SVG（粉色螃蟹，腿会动）。用户若要换吉祥物：

- **改配色**：修改 `COLORS` 和 `C`（螃蟹身体色）
- **换造型**：用用户提供的 SVG 替换 `MiniCrab` 组件，或改为 `import` PNG + `<Img>`（参考 Customize 写法）
- 保持 `crabX` 随 `currentTimeS / TOTAL_DURATION_S` 移动的逻辑不变

---

## 第五步：准备 Remotion 项目

询问用户：是否已有 overlay 项目？如有，直接 `cd` 进去；如没有，在用户指定目录新建：

```bash
npx create-video@latest --yes --overlay chapter-progress-bar
cd chapter-progress-bar
npm install
```

从本 skill 仓库复制所需文件到用户项目：

```
src/progress-bars/<SelectedComponent>.tsx   ← 选定风格的组件
src/progress-bars/assets/                   ← Customize 素材（如需要）
src/Root.tsx                                ← 参考本仓库，注册 Composition
```

若用户项目尚无 `progress-bars` 目录，创建 `src/progress-bars/` 并放入组件。

---

## 第六步：写入组件数据

打开选定的组件文件，修改三处：

1. **`TOTAL_DURATION_S`** — 视频总秒数
2. **`chapters[]`** — 用户确认的章节（`label` / `sub` / `startS` / `endS`）
3. **`COLORS` 等样式常量**（可选）

完整组件模板见 [`src/progress-bars/`](./src/progress-bars/) 中对应文件，**直接复制后改数据**，不要从零重写。

### `src/Root.tsx`

只注册用户选定的那一个 Composition（除非用户明确要求保留多种风格对比预览）。

**16:9 横屏**（默认）：
```tsx
width={1920} height={1080}
```

**9:16 竖屏**：
```tsx
width={1080} height={1920}
```

```tsx
import "./index.css";
import { Composition, CalculateMetadataFunction } from "remotion";
import { ChapterProgressBar } from "./progress-bars/ChapterProgressBar"; // 换成选定组件

const alphaMeta: CalculateMetadataFunction<Record<string, unknown>> = async () => ({
  defaultCodec: "prores",
  defaultVideoImageFormat: "png",
  defaultPixelFormat: "yuva444p10le",
  defaultProResProfile: "4444",
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ChapterProgressBar"           // 与选定风格的 Composition ID 一致
        component={ChapterProgressBar}    // 换成选定组件
        durationInFrames={945 * 30}       // TOTAL_DURATION_S × fps
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={alphaMeta}
      />
    </>
  );
};
```

各风格 Composition ID 见 [styles.md](./references/styles.md)。

---

## 第七步：启动预览服务器

写完代码后，直接运行：

```bash
npm run dev
```

然后告诉用户：
> 预览已启动，请打开 http://localhost:3000 查看效果。满意后告诉我，我给你渲染命令。

> [!IMPORTANT]
> **严禁自动执行渲染。** 不得运行任何 `remotion render` 命令，除非用户明确说"可以渲染"或"帮我渲染"。

---

## 第八步：用户明确要求后，给出渲染命令（不要帮用户执行）

用户确认效果 OK 后，**只给出命令，让用户自己粘贴执行**。将 `<CompositionId>` 替换为实际 ID（如 `DashProgressBar`）：

```bash
# WebM 透明背景（通用，DaVinci / Premiere）
npx remotion render <CompositionId> --codec=vp8 out/progress-bar.webm

# ProRes 4444 透明背景（Final Cut Pro）
npx remotion render <CompositionId> --codec=prores --prores-profile=4444 out/progress-bar.mov
```

渲染完成后，在剪辑软件里把文件拖到视频轨道最上层即可。

---

## 常见调整

| 需求 | 改哪里 |
|------|--------|
| 换风格 | 换 `src/progress-bars/` 中的组件 + 更新 Root.tsx |
| 进度条更矮/高 | 各组件的 `BAR_HEIGHT` |
| 更透明/不透明 | Chapter / Crab / Customize 的 `BAR_OPACITY` |
| 换配色 | `COLORS` 对象 |
| 字更大/小 | 各组件的 `fontSize` |
| 章节名/时间改了 | `chapters` 数组 + `TOTAL_DURATION_S` + Root 的 `durationInFrames` |
| Customize 换头像 | `assets/` 下 PNG + import 路径 |
| Crab 换吉祥物 | 替换 `MiniCrab` 或改 `COLORS` |

---

## 同时输出 YouTube 章节格式

生成进度条后，顺便把章节时间戳整理成 YouTube 描述格式：

```
0:00 章节一
2:07 章节二
...
```

（YouTube 要求第一个时间戳必须是 `0:00`）
