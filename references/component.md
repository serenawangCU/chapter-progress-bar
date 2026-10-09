# HyperFrames 组件与透明交付参考 · v3.0

## 项目结构

```text
chapter-progress-project/
├── BRIEF.md
├── STORYBOARD.md
├── hyperframes.json
├── index.html
├── compositions/
│   └── chapter-progress.html
├── snapshots/
└── renders/
```

`index.html` 只挂载透明进度条 composition。不要添加原视频或音轨。

## Composition 根节点

```html
<main
  id="root"
  data-composition-id="chapter-progress"
  data-start="0"
  data-duration="419.066"
  data-width="1920"
  data-height="1080"
  data-fps="30"
>
  <!-- transparent overlay only -->
</main>
```

页面样式必须显式透明：

```css
html, body, #root {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
  background: transparent;
}
```

## 章节数据

```js
const totalDuration = 419.066;
const chapters = [
  { label: "重新认识 HTML", start: 0, end: 39 },
  { label: "什么是 HTML", start: 39, end: 62 },
  { label: "1. HTML 做 PPT", start: 62, end: 106 },
];
```

每格宽度：

```js
const widthPercent = ((chapter.end - chapter.start) / totalDuration) * 100;
```

## 线性进度动画

```js
const timeline = gsap.timeline({ paused: true });
timeline.fromTo(
  "#chapter-progress-fill",
  { scaleX: 0, transformOrigin: "left center" },
  { scaleX: 1, transformOrigin: "left center", duration: totalDuration, ease: "none" },
  0,
);
window.__timelines["chapter-progress"] = timeline;
```

## 检查与预览

运行前先按 `/hyperframes-cli` 读取对应命令参考：

```bash
npx hyperframes check
npx hyperframes snapshot --at 0,39,62,180,418
npx hyperframes preview --background
```

## macOS 轻量透明 MOV 交付

### 推荐：一键脚本

从 skill 目录调用脚本：

```bash
bash scripts/export_alpha_mov.sh \
  /path/to/hyperframes-project \
  /path/to/materials/章节进度条-透明.mov
```

脚本会把 ProRes 中间文件放进系统临时目录，转换为 HEVC Alpha，使用 AVFoundation 验证 Alpha，
输出媒体参数，并在成功或失败后清理临时文件。下列分步命令用于诊断或无法调用脚本时。

### 1. 临时渲染 ProRes 4444 Alpha

使用明确的临时文件名，不要直接放进用户素材目录：

```bash
npx hyperframes render \
  --format mov \
  --quality looks \
  --output renders/chapter-progress-prores-alpha-temp.mov
```

### 2. 转成 HEVC Alpha

横屏 1920×1080：

```bash
avconvert \
  --source renders/chapter-progress-prores-alpha-temp.mov \
  --preset PresetHEVC1920x1080WithAlpha \
  --output renders/chapter-progress-transparent.mov \
  --replace \
  --progress
```

如果素材尺寸不同，使用 `PresetHEVCHighestQualityWithAlpha`，然后核对输出分辨率。

### 3. 验证媒体参数

```bash
ffprobe -v error \
  -show_entries stream=codec_name,codec_tag_string,width,height,r_frame_rate,duration:format=duration,size,format_name \
  -of json \
  renders/chapter-progress-transparent.mov
```

### 4. 用 AVFoundation 验证真实 Alpha

```bash
swift -module-cache-path /private/tmp/swift-module-cache -e '
import AVFoundation
import Foundation
let url = URL(fileURLWithPath: CommandLine.arguments[1])
let asset = AVURLAsset(url: url)
let track = asset.tracks(withMediaType: .video).first!
print(track.hasMediaCharacteristic(.containsAlphaChannel))
' renders/chapter-progress-transparent.mov
```

输出必须是 `true`。旧 API 的 deprecated warning 不影响结果。

### 5. 清理

确认以下条件全部成立后，删除临时 ProRes：

- 最终 MOV 非空。
- 时长与 composition 一致。
- 分辨率正确。
- AVFoundation Alpha 检查为 `true`。

然后只删除明确的中间文件：

```bash
rm renders/chapter-progress-prores-alpha-temp.mov
```

不要用宽泛通配符或递归删除。最终 HEVC Alpha MOV 保留在 `renders/`，并复制到用户指定的素材目录。

## 格式选择

| 格式 | 透明 | 体积 | 剪辑软件兼容性 | 默认 |
|---|---|---:|---|---|
| HEVC Alpha MOV | 是 | 小 | macOS 剪辑软件通常最好 | 是 |
| ProRes 4444 MOV | 是 | 很大 | 高 | 仅中间稿或回退 |
| VP9 Alpha WebM | 是 | 很小 | 不稳定，可能显示黑底 | 否 |
| MP4/H.264 | 否 | 小 | 高 | 禁止用于透明 overlay |
