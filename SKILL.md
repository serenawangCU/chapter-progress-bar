---
name: chapter-progress-bar
description: >
  根据视频字幕（.srt）或时间戳，用 HyperFrames 生成章节进度条透明 overlay，
  支持 Chapter、Dash、Minimal、Text Highlight、Customize、Crab 六种视觉风格，
  并在 macOS 上交付轻量、剪辑软件兼容的 HEVC Alpha MOV。用于章节划分、进度条设计、
  透明视频预览、渲染与交付；除非用户明确要求，否则不要使用 Remotion。
metadata:
  author: Serena心心
  version: "3.0"
---

# Chapter Progress Bar v3.0

用 HyperFrames 制作章节进度条透明 overlay。默认交付是完整画布、无音频、带真实透明通道的
HEVC Alpha MOV；不要把原视频嵌入 overlay，也不要默认使用 Remotion。

## 关键原则

1. **默认实现：HyperFrames HTML。** 先读 `/hyperframes`，按需再读 `/hyperframes-core`、
   `/hyperframes-animation` 与 `/hyperframes-cli`。遵守 HyperFrames 的检查、预览、审批和项目历史规则。
2. **默认交付：HEVC Alpha MOV。** HyperFrames 的透明 WebM 可能在剪辑软件里被显示为黑底，
   因此 macOS 上不要把 WebM 当成默认成片。
3. **轻量交付流程：** HyperFrames 临时渲染透明 ProRes 4444 MOV，再用 macOS `avconvert`
   转成 HEVC Alpha MOV；验证最终 Alpha 后删除大体积 ProRes 中间文件。
4. **不嵌入原视频。** 成片只包含进度条和透明区域，方便用户在剪辑软件里叠加。
5. **先确认章节，再制作。** 用户给 SRT 时先分析自然段落并列出章节，得到确认后再写 composition。
6. **不要默认使用 Remotion。** 只有用户明确指定 Remotion 时才使用。`src/` 下旧 TSX 文件仅供视觉参考，
   不要复制、执行或作为新项目实现。

## 参考资料

- [styles.md](./references/styles.md)：六种风格、布局和视觉参数。
- [component.md](./references/component.md)：HyperFrames 文件结构、章节数据、渲染和 Alpha 验证命令。
- [export_alpha_mov.sh](./scripts/export_alpha_mov.sh)：macOS 一键渲染、HEVC Alpha 转换、验证和中间文件清理。
- [previews/](./previews/)：各风格旧预览图，只作为视觉参考。

## 一、确认输入

只追问尚未明确的信息。用户回复“默认 / skip / 都行”时采用以下默认值：

- 章节来源：SRT 或用户提供的时间戳。
- 风格：Chapter（米色分段条 + 章节名）。
- 位置：顶部。
- 比例：横屏 16:9，1920×1080，30 fps。
- 配色：已播放 `#C09070`，未播放 `#EDE4D4`。
- 条高：62px，另加约 10px 透明渐隐阴影；用户要求更窄时优先改高度，不缩放整张画布。
- 输出：无音频的透明 HEVC Alpha MOV。

### SRT 模式

1. 读取字幕最后一条的结束时间作为总时长。
2. 按话题转换找自然章节，不要机械均分。
3. 列出 `时间戳 + 简短章节名`，先让用户确认。
4. 短章节标题优先缩写，例如 `1. HTML 做 PPT`，避免文字被分隔线裁切。

### 时间戳模式

直接使用用户提供的章节，但确认总时长覆盖到最后一章。每章结束时间等于下一章开始时间，
最后一章结束时间等于视频总时长。

## 二、创建或恢复 HyperFrames 项目

如果已有 HyperFrames 项目，恢复并先运行 `npx hyperframes timeline --json`；不要另建重复项目。
新项目按 `/hyperframes` 的路由和初始化规则创建。

Overlay composition 必须满足：

- 根画布背景与 `html, body` 背景均为 `transparent`。
- 根节点声明准确的 `data-duration`、`data-width`、`data-height`、`data-fps="30"`。
- 进度条是独立 HTML composition；不要加入源视频或音轨。
- 动画必须可 seek、确定性渲染。线性进度使用暂停的 GSAP timeline，`ease: "none"`。
- 进度填充优先动画 `transform: scaleX()`，原点为左侧；不要逐帧修改宽度。
- 顶部样式用 `top: 0`，底部样式用 `bottom: 0`；整张画布仍保持目标视频尺寸。

### 章节宽度

按时长比例计算每格宽度：

```text
widthPercent = (chapterEnd - chapterStart) / totalDuration * 100
```

保留至少三位小数，确保所有宽度总和接近 100%。不要凭视觉手工均分。

## 三、视觉与文字检查

写完后必须检查最短的几章，以及 2–3 个章节切换点：

- 标题是否被分隔线压住、裁切或溢出。
- 字号是否因格宽过窄而不可读。
- Customize / Crab 的头像或 SVG 是否遮挡文字。
- 进度填充在开始、中间和结束时位置是否准确。
- 除进度条外的画面是否透明。

处理优先级：缩短标题 → 减小短格字号 → 去掉副标题 → 微调布局。不要为了塞字而把整条做得过高。

## 四、检查与预览

按 `/hyperframes-cli` 执行：

```bash
npx hyperframes check
npx hyperframes snapshot --at <若干关键秒数>
npx hyperframes preview --background
```

确认预览 URL 可访问，并让用户检查最终外观。除非用户已经明确批准当前预览，否则不要渲染成片。

## 五、默认交付：轻量 HEVC Alpha MOV（macOS）

用户批准后执行以下流程。详细命令见 [component.md](./references/component.md)。

1. 再检查一次 HyperFrames 用量与项目状态。
2. 渲染透明 MOV 到临时路径。HyperFrames MOV 是 ProRes 4444，文件可能达到数 GB，
   因此它只是中间文件，不复制到素材目录。
3. 用 macOS `avconvert` 的 `PresetHEVC1920x1080WithAlpha`（竖屏用对应最高质量 Alpha preset）
   转成最终 HEVC Alpha MOV。
4. 用 `ffprobe` 验证分辨率、帧率和时长；再用 AVFoundation 验证
   `containsAlphaChannel == true`。不能只看扩展名或播放器黑色背景来判断透明。
5. 将最终 MOV 复制到用户素材目录，使用清楚的文件名，例如 `章节进度条-透明.mov`。
6. 只有在最终文件非空、时长正确且 Alpha 验证为 true 后，才删除 ProRes 中间文件。

在 macOS 上优先运行 `scripts/export_alpha_mov.sh`，它会把 ProRes 放在系统临时目录，
完成 HEVC Alpha 验证后自动清理；只有需要诊断时才手动执行分步命令。

### 为什么不用 WebM 作为默认成片

VP9 WebM 可以含真实 Alpha，但部分剪辑软件不解码 VP9 Alpha，会把透明区域显示成黑色。
WebM 只在用户明确说明目标软件支持 VP9 Alpha，或用途是网页播放时交付。

### 失败与回退

- 若 `avconvert` 不存在或 HEVC Alpha 编码失败，先说明平台限制，不要声称文件透明。
- 可选回退为 ProRes 4444 MOV（兼容性高但很大）或 VP9 Alpha WebM（小但兼容性不稳定）。
- 若剪辑软件仍把 HEVC Alpha 显示为黑色，交付裁切高度的 ProRes 4444 MOV 作为轻量回退，
  并提示用户在时间线上把它对齐到顶部或底部。

## 六、交付说明

最终回复至少说明：

- 文件路径和可点击链接。
- 编码格式、分辨率、时长、文件大小、无音频。
- Alpha 验证结果。
- 明确提示不要再使用旧的 WebM 黑底版本（若存在）。
- 若删除了大体积中间文件，说明已删除且可以重新生成。

同时给出 YouTube 章节格式：

```text
0:00 章节一
0:39 章节二
```

第一个时间戳必须是 `0:00`。
