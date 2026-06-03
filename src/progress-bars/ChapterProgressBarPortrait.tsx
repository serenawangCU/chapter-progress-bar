import { loadFont } from "@remotion/google-fonts/NotoSansSC";
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const { fontFamily } = loadFont("normal", { weights: ["700"] });

const TOTAL_DURATION_S = 300;

const chapters = [
  { label: "开场", sub: "", startS: 0, endS: 60 },
  { label: "第一章", sub: "", startS: 60, endS: 120 },
  { label: "第二章", sub: "", startS: 120, endS: 210 },
  { label: "第三章", sub: "", startS: 210, endS: 270 },
  { label: "结尾", sub: "", startS: 270, endS: 300 },
];

const COLORS = {
  filled: "#C09070",
  unfilled: "#EDE4D4",
  divider: "#CBBFA8",
  text: "#4A3220",
  shadow: "rgba(60, 40, 20, 0.18)",
};

const BAR_HEIGHT = 56;
const BAR_OPACITY = 0.82;

export const ChapterProgressBarPortrait: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const currentTimeS = frame / fps;

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
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
          const segDuration = chapter.endS - chapter.startS;
          const widthPct = (segDuration / TOTAL_DURATION_S) * 100;
          const cellWidth = (segDuration / TOTAL_DURATION_S) * width;
          const isCompleted = currentTimeS >= chapter.endS;
          const isActive =
            currentTimeS >= chapter.startS && currentTimeS < chapter.endS;
          const fill = isCompleted
            ? 1
            : isActive
              ? (currentTimeS - chapter.startS) / segDuration
              : 0;
          const showSub = Boolean(chapter.sub) && cellWidth >= 52;

          return (
            <div
              key={chapter.label}
              style={{
                width: `${widthPct}%`,
                height: "100%",
                position: "relative",
                backgroundColor: COLORS.unfilled,
                borderRight:
                  i < chapters.length - 1
                    ? `1px solid ${COLORS.divider}`
                    : "none",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${fill * 100}%`,
                  height: "100%",
                  backgroundColor: COLORS.filled,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0,
                  overflow: "hidden",
                  userSelect: "none",
                  padding: "0 2px",
                }}
              >
                <div
                  style={{
                    fontFamily,
                    fontSize: cellWidth < 48 ? 9 : 11,
                    fontWeight: "700",
                    color: COLORS.text,
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}
                >
                  {chapter.label}
                </div>
                {showSub && (
                  <div
                    style={{
                      fontFamily,
                      fontSize: 8,
                      fontWeight: "400",
                      color: COLORS.text,
                      letterSpacing: "0.02em",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                      opacity: 0.8,
                    }}
                  >
                    {chapter.sub}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
