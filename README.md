# 视频章节进度条动画 · Chapter Progress Bar v3.0

根据 `.srt` 字幕或时间戳，用 HyperFrames 生成透明章节进度条 overlay，并在 macOS 上交付轻量、剪辑软件兼容的 HEVC Alpha MOV。

## v3.0 的变化

- 默认实现从 Remotion 改为 HyperFrames HTML。
- 默认成片从 WebM 改为 HEVC Alpha MOV，避免部分剪辑软件把 VP9 Alpha 显示成黑底。
- 临时 ProRes 4444 只用于中间转换；最终 Alpha 验证通过后立即删除，避免长期占用数 GB 空间。
- 默认输出完整 1920×1080 透明画布，导入时间线后无需重新定位进度条。

## 六种风格

1. Chapter（默认）：米色分段条 + 章节名。
2. Dash：分段短线 + 章节名。
3. Minimal：细线 + 节点圆点。
4. Text Highlight：纯文字高亮。
5. Customize：进度条 + 用户透明 PNG 头像。
6. Crab：粉色进度条 + 螃蟹 SVG。

预览图在 [`previews/`](previews/)，详细参数见 [`references/styles.md`](references/styles.md)。

## 使用示例

```text
帮我根据这份 SRT 做一个 Chapter 风格的章节进度条。
放在顶部，横屏 16:9；先给我确认章节，满意后导出透明 MOV 到素材目录。
```

默认流程：

1. 分析字幕并确认章节。
2. 用 HyperFrames 制作透明 overlay。
3. 检查文字、布局和关键时间点。
4. 在 HyperFrames 预览中确认样式。
5. 临时渲染 ProRes 4444 Alpha。
6. 转换成 HEVC Alpha MOV 并验证真实透明通道。
7. 复制最终小体积 MOV 到素材目录，删除大体积中间文件。

## 输出格式

| 格式 | 透明 | 体积 | 用途 |
|---|---|---:|---|
| HEVC Alpha MOV | 是 | 小 | 默认剪辑成片 |
| ProRes 4444 MOV | 是 | 很大 | 临时中间稿或兼容性回退 |
| VP9 Alpha WebM | 是 | 很小 | 仅在目标软件明确支持时使用 |

完整工作流见 [`SKILL.md`](SKILL.md)。

## 作者

Made by [心心 Serena](https://www.youtube.com/@serena_xinxin) · [用AI发电社群](https://pathunfold.com/serena)
