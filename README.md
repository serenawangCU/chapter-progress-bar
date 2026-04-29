# 📊 视频进度条动画 · Chapter Progress Bar

**一键为 YouTube 视频生成章节进度条动画** —— 透明背景，可直接叠加在视频上，基于 [Remotion](https://remotion.dev) 的 AI Agent Skill。

给视频顶部加一条进度条，清晰显示当前播放到哪个章节，随着视频播放自动填充。支持横屏（16:9）和竖屏（9:16）。

---

## 效果预览 · Preview

进度条横跨视频顶部，每个章节占据对应时长的宽度，已播放部分填充为暖棕色，未播放部分为浅米色。

![Chapter Progress Bar Preview](preview.png)

---

## 功能 · Features

- **自动分析字幕**：读取 `.srt` 文件，建议章节划分
- **直接输入时间戳**：无需字幕，自己指定 `2:07 章节名` 格式即可
- **透明背景**：导出 WebM 或 ProRes，直接叠加在视频上
- **米色配色**：暖棕 + 浅米，低调不抢戏
- **可自定义**：高度、透明度、颜色、字号均可调整
- **附赠 YouTube 章节格式**：同时输出可直接粘贴到视频描述的时间戳

---

## 使用方式 · How to Use

### 前置条件

- Node.js ≥ 18
- 已安装 Claude Code

### 触发方式

**方式一**：直接输入 slash command：
```
/chapter-progress-bar
```

**方式二**：自然语言，Claude 自动识别：
```
帮我给这个视频做章节进度条  →  提供 .srt 文件

2:07 文件夹结构
4:46 自动化输入流
7:08 闪念胶囊
帮我做进度条               →  直接用这些时间戳
```

### 流程

1. Claude 读取字幕 / 接收时间戳，确认章节划分
2. 创建或复用 Remotion overlay 项目
3. 生成 `ChapterProgressBar.tsx` 和 `Root.tsx`
4. 启动预览 `npm run dev`，在浏览器里查看效果
5. 渲染输出透明背景视频文件

---

## 输出格式 · Output

| 格式 | 命令 | 适用场景 |
|------|------|---------|
| WebM (VP8) | `--codec=vp8` | 通用，DaVinci / Premiere |
| ProRes 4444 | `--codec=prores --prores-profile=4444` | Final Cut Pro |

渲染完成后，在剪辑软件里把文件拖到视频轨道**最上层**即可。

---

## 自定义参数 · Customization

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `BAR_HEIGHT` | `52px` | 进度条高度 |
| `opacity` | `0.82` | 透明度（0 全透明 → 1 不透明） |
| `COLORS.filled` | `#C09070` | 已播放颜色 |
| `COLORS.unfilled` | `#EDE4D4` | 未播放颜色 |
| `fontSize` | `20px` | 章节文字大小 |

---

## 作者 · Author

Made by [心心 Serena](https://www.youtube.com/@serena_xinxin) · [用AI发电社群](https://pathunfold.com/serena)
