---
name: chapter-progress-bar
description: >
  根据视频字幕文件（.srt）或用户直接提供的时间戳，生成章节进度条视频（透明背景 overlay），
  使用 Remotion overlay 模板，可叠加在任何视频上方。
  米色配色，支持自定义章节名称、时间戳、透明度和高度。
  Use when the user wants to create a chapter/section progress bar or chapter indicator
  overlay for a video, whether they provide a .srt subtitle file or directly specify
  timestamps and chapter names (e.g. "2:07 文件夹结构, 4:46 输入管道").
metadata:
  author: serena
  version: "1.0"
---

## References

- [component.md](./component.md) — 关键常量说明、渲染命令
- [src/ChapterProgressBar.tsx](./src/ChapterProgressBar.tsx) — 主组件源码
- [src/Root.tsx](./src/Root.tsx) — Composition 注册

# Chapter Progress Bar

根据 `.srt` 字幕文件自动生成视频顶部的章节进度条，透明背景，可直接叠加在视频上。

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

---

两种模式都需要确认：
- **配色偏好**：默认米色（beige），可自定义
- **进度条高度**：默认 52px，可调整
- **透明度**：默认 0.82，可调整

时间戳换算公式：`总秒数 = 分钟 × 60 + 秒`

## 第三步：准备 Remotion 项目

询问用户：是否已有 overlay 项目？如有，直接 `cd` 进去；如没有，在用户指定目录新建：

```bash
npx create-video@latest --yes --overlay chapter-progress-bar
cd chapter-progress-bar
npm install
```

## 第四步：写入组件文件

### `src/ChapterProgressBar.tsx`

用以下模板，填入实际章节数据：

```tsx
import { loadFont } from "@remotion/google-fonts/NotoSansSC";
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
});

// 视频总时长（秒）
const TOTAL_DURATION_S = /* 从字幕读取 */;

// 章节定义：由用户确认的时间戳和名称
const chapters = [
  { name: "章节名", startS: 0,   endS: 0 },
  // ... 更多章节
];

// 配色方案（米色）
const COLORS = {
  filled:   "#C09070",               // 已播放：温暖棕褐
  unfilled: "#EDE4D4",               // 未播放：浅米色
  divider:  "#CBBFA8",               // 分隔线
  text:     "#4A3220",               // 章节文字
  shadow:   "rgba(60, 40, 20, 0.18)",
};

const BAR_HEIGHT = 52;   // 进度条高度（px），可调整
const BAR_OPACITY = 0.82; // 透明度，可调整

export const ChapterProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeS = frame / fps;

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {/* 底部阴影 */}
      <div
        style={{
          position: "absolute",
          top: BAR_HEIGHT,
          left: 0,
          right: 0,
          height: 8,
          background: `linear-gradient(to bottom, ${COLORS.shadow}, transparent)`,
        }}
      />

      {/* 进度条主体 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: BAR_HEIGHT,
          display: "flex",
          opacity: BAR_OPACITY,
        }}
      >
        {chapters.map((chapter, i) => {
          const segmentDuration = chapter.endS - chapter.startS;
          const segmentWidthPct = (segmentDuration / TOTAL_DURATION_S) * 100;

          const isCompleted = currentTimeS >= chapter.endS;
          const isActive = currentTimeS >= chapter.startS && currentTimeS < chapter.endS;

          const fillProgress = isCompleted
            ? 1
            : isActive
              ? (currentTimeS - chapter.startS) / segmentDuration
              : 0;

          return (
            <div
              key={chapter.name}
              style={{
                width: `${segmentWidthPct}%`,
                height: "100%",
                position: "relative",
                backgroundColor: COLORS.unfilled,
                borderRight: i < chapters.length - 1 ? `2px solid ${COLORS.divider}` : "none",
                overflow: "hidden",
              }}
            >
              {/* 进度填充 */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${fillProgress * 100}%`,
                  height: "100%",
                  backgroundColor: COLORS.filled,
                }}
              />

              {/* 章节名称 */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily,
                  fontSize: 20,
                  fontWeight: "700",
                  color: COLORS.text,
                  letterSpacing: "0.08em",
                  userSelect: "none",
                }}
              >
                {chapter.name}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

### `src/Root.tsx`

```tsx
import "./index.css";
import { Composition } from "remotion";
import { ChapterProgressBar } from "./ChapterProgressBar";

// 总帧数 = 总秒数 × fps（默认 30）
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ChapterProgressBar"
        component={ChapterProgressBar}
        durationInFrames={/* 总秒数 × 30 */}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
```

## 第五步：预览

```bash
npm run dev
# 浏览器打开 http://localhost:3000 查看效果
```

## 第六步：渲染输出（透明背景）

```bash
# 输出 WebM（透明通道，推荐用于视频叠加）
npx remotion render ChapterProgressBar --codec=vp8 out/progress-bar.webm

# 或输出 ProRes 4444（Final Cut Pro / DaVinci 等专业软件）
npx remotion render ChapterProgressBar --codec=prores --prores-profile=4444 out/progress-bar.mov
```

渲染完成后，在剪辑软件里把输出文件拖到视频轨道最上层即可。

## 常见调整

| 需求 | 改哪里 |
|------|--------|
| 进度条更矮/高 | `BAR_HEIGHT` 常量 |
| 更透明/不透明 | `BAR_OPACITY` 常量（0–1） |
| 换配色 | `COLORS` 对象 |
| 字更大/小 | `fontSize` 属性 |
| 章节名/时间改了 | `chapters` 数组 |

## 同时输出 YouTube 章节格式

生成进度条后，顺便把章节时间戳整理成 YouTube 描述格式：

```
0:00 章节一
2:07 章节二
...
```

（YouTube 要求第一个时间戳必须是 `0:00`）
