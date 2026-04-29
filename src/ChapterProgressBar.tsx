import { loadFont } from "@remotion/google-fonts/NotoSansSC";
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
});

// 视频总时长（秒）：15分45秒
const TOTAL_DURATION_S = 945;

// 章节定义（精确时间戳）
const chapters = [
  { name: "为何用Obsidian", startS: 0, endS: 127 }, // 0:00  - 2:07
  { name: "文件夹结构", startS: 127, endS: 286 },  // 2:07  - 4:46
  { name: "自动化输入流", startS: 286, endS: 428 }, // 4:46  - 7:08
  { name: "闪念胶囊",  startS: 428, endS: 526 },  // 7:08  - 8:46
  { name: "思维导图",  startS: 526, endS: 614 },  // 8:46  - 10:14
  { name: "Obsidian+AI", startS: 614, endS: 709 }, // 10:14 - 11:49
  { name: "节省Token", startS: 709, endS: 803 },  // 11:49 - 13:23
  { name: "灵魂Skills", startS: 803, endS: 868 }, // 13:23 - 14:28
  { name: "结语愿景",  startS: 868, endS: 945 },  // 14:28 - 15:45
];

// 米色配色方案
const COLORS = {
  filled: "#C09070",      // 温暖棕褐色（进度）
  unfilled: "#EDE4D4",    // 浅米色（未播放）
  divider: "#CBBFA8",     // 分隔线
  text: "#4A3220",        // 深棕色文字（在两种背景上都清晰）
  shadow: "rgba(60, 40, 20, 0.18)",
};

const BAR_HEIGHT = 52;

export const ChapterProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeS = frame / fps;

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {/* 底部阴影条 */}
      <div
        style={{
          position: "absolute",
          top: BAR_HEIGHT,
          left: 0,
          right: 0,
          height: 8,
          background: `linear-gradient(to bottom, ${COLORS.shadow}, transparent)`,
          pointerEvents: "none",
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
          opacity: 0.82,
        }}
      >
        {chapters.map((chapter, i) => {
          const segmentDuration = chapter.endS - chapter.startS;
          const segmentWidthPct =
            (segmentDuration / TOTAL_DURATION_S) * 100;

          const isCompleted = currentTimeS >= chapter.endS;
          const isActive =
            currentTimeS >= chapter.startS && currentTimeS < chapter.endS;

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
                borderRight:
                  i < chapters.length - 1
                    ? `2px solid ${COLORS.divider}`
                    : "none",
                overflow: "hidden",
              }}
            >
              {/* 填充进度 */}
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
