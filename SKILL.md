---
name: chapter-progress-bar
description: >
  根据视频字幕文件（.srt）或用户直接提供的时间戳，生成章节进度条 overlay 视频（透明背景），
  支持 6 种风格：默认米色 Chapter、Dash、Minimal、TextHighlight、
  Customize（自定义 PNG 头像）、Crab（螃蟹 SVG 动画）。
  Chapter 风格可自定义顶部/底部、横屏/竖屏；其他风格改布局可参考 Chapter 对应组件。
  Use when the user wants to create a chapter/section progress bar overlay for a video,
  choose among multiple visual styles, or customize with their own image asset.
metadata:
  author: Serena心心
  version: "2.0"
---

## References

- [styles.md](./references/styles.md) — 6 种风格对照表、Chapter 布局选项、Composition ID
- [component.md](./references/component.md) — 关键常量、文件结构、渲染命令
- [src/progress-bars/](./src/progress-bars/) — 全部组件源码（直接复制修改）
- [src/Root.tsx](./src/Root.tsx) — Composition 注册示例

# Chapter Progress Bar v2.0

根据 `.srt` 字幕或时间戳，生成视频章节进度条 overlay。v2.0 提供 **6 种风格**（默认米色 Chapter）——可定制位置与比例，也支持 PNG 头像、SVG 吉祥物等品牌素材。

> [!IMPORTANT]
> **核心原则：不要删除其他风格的 demo 和组件代码。**
> 这个 skill 的 6 种风格组件都是资产。即使用户这次只用一种风格，也要**保留全部组件文件并在 Root.tsx 注册全部 Composition**，只对选定风格写入真实数据。用户随时可能换风格、对比效果、下次复用。
> 仅当用户**明确要求**「删掉/精简其他风格」时才移除，且移除前先复述确认。详见第五步、第六步。

## 第一步：向用户确认需求

**开工前先向用户确认以下事项。** 建议**一次性列出所有问题**，并在每题后标注默认值。用户回复 **skip / 默认 / 都行** 时，未答项全部采用默认。

### 确认清单（附默认值）

```
你好！做进度条前确认几件事——默认选项可直接回复 skip：

① 章节怎么分？
   · 发 .srt 字幕文件 → 我来分析并建议章节划分，你确认后再做
   · 或直接给时间戳 + 章节名，例如：
     0:00 开场
     2:07 文件夹结构
   · 还需知道视频总时长

② 哪种风格？（6 选 1）
   Chapter / Dash / Minimal / Text Highlight / Customize / Crab
   默认：Chapter（米色分段条 + 章节名）

③ 条放哪里？（全部风格均适用）
   顶部 / 底部
   默认：顶部

④ 视频比例？（全部风格均适用）
   横屏 16:9 / 竖屏 9:16
   默认：横屏 16:9

⑤ 主题色 & 底色？（已播放 / 未播放）
   默认：#C09070 / #EDE4D4
   （若选 Crab 风格，默认改为粉色系 #E8738A / #F5C0CC）

回复 skip 即可全部用默认；也可以只改某几项。
```

### 章节划分（第 ① 项）

**模式 A — 用户提供 `.srt` 字幕**

1. 读取文件，找出视频总时长（最后一条字幕的结束时间）
2. 分析内容结构，找出自然段落（话题转换点）
3. 向用户**列出建议的章节划分**，等用户确认后再继续
4. 不要跳过确认——即使用户给了字幕，也要让用户点头认可章节切分

**模式 B — 用户直接给出时间戳和章节名**

直接使用，但仍需确认视频总时长与章节列表是否完整。

时间戳换算：`总秒数 = 分钟 × 60 + 秒`

> 用户已在对话里明确给出了部分信息（如风格、比例）时，只追问缺失项，**不要重复询问已知答案**。

---

## 第二步：选择进度条风格

若第一步已选定风格，跳过此步。否则向用户展示 **6 种风格**：

| 风格 | 组件 | Composition ID | 说明 |
|------|------|----------------|------|
| **Chapter（默认）** | 见第三步布局表 | 见第三步 | 米色分段条 + 章节名 |
| Dash | `DashProgressBar` | `DashProgressBar` | 分段破折号 + 下方章节名 |
| Minimal | `MinimalProgressBar` | `MinimalProgressBar` | 极简单线 + 节点圆点，无文字 |
| Text Highlight | `TextHighlightProgressBar` | `TextHighlightProgressBar` | 纯文字高亮，`\|` 分隔 |
| Customize | `KyomiProgressBar` | `KyomiProgressBar` | 米色条 + 用户上传 PNG 头像 |
| Crab | `CrabProgressBar` | `CrabProgressBar` | 粉色条 + 内置螃蟹 SVG |

> 风格源码均在 [`src/progress-bars/`](./src/progress-bars/)，选定后只修改对应文件。

---

## 第三步：确定组件与章节数据

根据第一步确认的结果，选定组件并写入数据。

### 布局与组件选择（位置 × 比例）

**全部 6 种风格**都支持顶部/底部、横屏/竖屏。Chapter 有现成组件可直接选用：

| 位置 | 比例 | 组件 | Composition ID | Root 尺寸 |
|------|------|------|----------------|-----------|
| 顶部（默认） | 横屏 16:9 | `ChapterProgressBar` | `ChapterProgressBar` | 1920×1080 |
| 底部 | 横屏 16:9 | `ChapterProgressBarBottom` | `ChapterProgressBarBottom` | 1920×1080 |
| 顶部 | 竖屏 9:16 | `ChapterProgressBarPortrait` | `ChapterProgressBarPortrait` | 1080×1920 |

**其他 5 种风格**（Dash / Minimal / Text Highlight / Customize / Crab）：

- **竖屏 9:16**：Root 设为 `1080×1920`；参考 `ChapterProgressBarPortrait.tsx` 的自适应字号与窄格布局
- **条放底部**：参考 `ChapterProgressBarBottom.tsx`（`bottom: 0`、阴影方向等），将同样逻辑应用到所选风格组件
- **底部 + 竖屏**：同时参考上述两个文件

> 仓库里只为 Chapter 提供了 3 个布局变体文件；其他风格需 Agent 按 Chapter 的改法自行调整，不是做不到，只是没有预置文件。

### 配色写入

将第一步确认的主题色 / 底色写入组件 `COLORS` 对象：

```tsx
const COLORS = {
  filled: "#C09070",    // 主题色（已播放）— 用户指定或默认
  unfilled: "#EDE4D4",  // 底色（未播放）— 用户指定或默认
  // ...
};
```

### 章节数据结构

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

从本 skill 仓库复制文件到用户项目。**默认整目录复制，保留全部 6 种风格组件**——这样用户随时能换风格、对比 demo：

```
src/progress-bars/        ← 整个目录全部组件（不要只挑选定的那一个）
src/progress-bars/assets/ ← Customize 素材（随目录一起带上）
src/Root.tsx              ← 参考本仓库，注册全部风格的 Composition
```

若用户项目尚无 `progress-bars` 目录，创建 `src/progress-bars/` 并放入**全部**组件。

> [!IMPORTANT]
> **不要只复制选定风格那一个组件、删掉其余。** demo 组件是这个 skill 的资产，全部带上几乎没有成本（都是纯前端组件），但能让用户随时切换、对比。仅当用户明确要求精简时才删。

---

## 第六步：写入组件数据

打开选定的组件文件，修改三处：

1. **`TOTAL_DURATION_S`** — 视频总秒数
2. **`chapters[]`** — 用户确认的章节（`label` / `sub` / `startS` / `endS`）
3. **`COLORS` 等样式常量**（可选）

完整组件模板见 [`src/progress-bars/`](./src/progress-bars/) 中对应文件，**直接复制后改数据**，不要从零重写。

### `src/Root.tsx`

> [!IMPORTANT]
> **禁止删除其他风格的 Composition 注册和组件代码。**
> 默认要**保留全部 6 种风格的 demo**——它们是这个 skill 的核心资产，用户随时可能换风格、对比效果，或下次复用。
> 正确做法：在 Root.tsx 里**新增或更新**用户选定风格的 Composition（写入真实数据、改 `durationInFrames`、按比例改 `width`/`height`），**其余 Composition 原样留着**，组件文件一个都不要删。
> 只有当用户**明确说出**「删掉其他风格 / 只保留这一个 / 精简掉 demo」时，才可以移除——而且要先复述一遍确认。

下面是只含一个 Composition 的最小示例（用于全新空项目）；**若项目里已注册了多种风格，照上面的规则在其基础上增改，不要替换成这个最小版本。**

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

## 第七步：检查章节文字是否被遮挡

生成进度条后、告知用户预览之前，**必须自动做一次文字可读性检查**。章节一多、某段时长一短，或者 Customize / Crab 的吉祥物在条上移动时，很容易出现「字被竖线切到」「字溢出格子」或「图片盖住字」——这类问题要在交付预览前发现并修掉。

### 检查什么

重点看章节名（`label` / `sub`）是否被以下元素影响：

| 风险来源 | 常见于 | 表现 |
|----------|--------|------|
| **竖向分隔线** | Chapter、Crab、Customize | 分隔线正好压在字中间，或字跨两格 |
| **格宽太窄** | 章节多、某段时长短、竖屏 9:16 | 文字被 `overflow: hidden` 裁切，或两行叠在一起 |
| **PNG 头像 / SVG 吉祥物** | Customize、Crab | 头像或螃蟹爬过某格时，盖住该格章节名 |

> Minimal 无文字，Text Highlight 无竖条分隔，可跳过竖线相关检查，但仍需确认文字没有挤在一起。

### 怎么检查

1. **估算每格宽度**（像素）：
   ```
   格宽 ≈ (chapter.endS - chapter.startS) / TOTAL_DURATION_S × 画布宽度
   ```
   竖屏画布宽度为 1080，横屏为 1920。

2. **对照文字长度**：逐条看 `label`（和 `sub`）在该格宽里是否合理；**优先检查时长最短的几格**。

3. **预览截图核查**（推荐）：启动预览后，在 Remotion Studio 里跳到 **3:00** 以及 2–3 个章节切换点，肉眼看：
   - 字有没有被竖线「切」到
   - 字有没有只露出一半
   - Customize 头像 / Crab 有没有盖住正在播放那一格的标题

   也可用 `remotion still` 在同一时间点导出截图辅助判断。

4. **有问题就改，改完再查一遍**，直到文字清晰可读。

### 常见问题与修复

| 问题 | 处理方式 |
|------|----------|
| 竖线压在字上 | 缩短章节名、去掉 `sub`、略减小 `fontSize`、或微调章节边界让格宽更均匀 |
| 字被裁切 / 溢出 | 同上；竖屏参考 `ChapterProgressBarPortrait` 的自适应字号逻辑 |
| 头像 / 螃蟹盖住字 | 缩小 `HEAD_H` / `CRAB_W`，或调整吉祥物 vertical 位置，确保不遮挡当前格标题 |
| 章节太多、怎么改都挤 | 建议用户合并相邻章节，或改用 Dash / Text Highlight / Minimal |

> [!IMPORTANT]
> **检查通过之前，不要告诉用户「已经完成」。** 应主动说明发现了什么问题、做了什么调整。

---

## 第八步：启动预览服务器

写完代码后，直接运行：

```bash
npm run dev
```

然后告诉用户：
> 预览已启动，请打开 http://localhost:3000 查看效果。满意后告诉我，我给你渲染命令。

> [!IMPORTANT]
> **严禁自动执行渲染。** 不得运行任何 `remotion render` 命令，除非用户明确说"可以渲染"或"帮我渲染"。

---

## 第九步：用户明确要求后，给出渲染命令（不要帮用户执行）

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
| 字被竖线挡 / 被裁切 | 缩短 `label`、去掉 `sub`、调 `fontSize`；见第六步可读性检查 |
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
