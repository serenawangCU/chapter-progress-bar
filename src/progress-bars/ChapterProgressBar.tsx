import { loadFont } from "@remotion/google-fonts/NotoSansSC";
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const { fontFamily } = loadFont("normal", { weights: ["700"] });

const TOTAL_DURATION_S = 663; // 11:03 — 字幕最后一条结束时间

const chapters = [
  { label: "开场",     sub: "",       startS: 0,   endS: 70  },
  { label: "Demo 1",  sub: "截图复刻", startS: 70,  endS: 102 },
  { label: "Demo 2",  sub: "贸易路线", startS: 102, endS: 175 },
  { label: "Demo 3",  sub: "视频链接", startS: 175, endS: 197 },
  { label: "原理讲解", sub: "",       startS: 197, endS: 251 },
  { label: "Demo 4",  sub: "进度条",  startS: 251, endS: 289 },
  { label: "Demo 5",  sub: "音效字幕", startS: 289, endS: 343 },
  { label: "Demo 6",  sub: "打字机",  startS: 343, endS: 379 },
  { label: "AI创作营", sub: "",       startS: 379, endS: 401 },
  { label: "<用AI发电>", sub: "",      startS: 401, endS: 663 },
];

const COLORS = {
  filled:   "#C09070",
  unfilled: "#EDE4D4",
  divider:  "#CBBFA8",
  text:     "#4A3220",
  shadow:   "rgba(60, 40, 20, 0.18)",
};

const BAR_HEIGHT = 52;
const BAR_OPACITY = 0.82;

export const ChapterProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeS = frame / fps;

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {/* 底部阴影 */}
      <div style={{
        position: "absolute", top: BAR_HEIGHT, left: 0, right: 0, height: 8,
        background: `linear-gradient(to bottom, ${COLORS.shadow}, transparent)`,
      }} />

      {/* 进度条主体 */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: BAR_HEIGHT, display: "flex", opacity: BAR_OPACITY,
      }}>
        {chapters.map((chapter, i) => {
          const segDuration = chapter.endS - chapter.startS;
          const widthPct = (segDuration / TOTAL_DURATION_S) * 100;
          const isCompleted = currentTimeS >= chapter.endS;
          const isActive = currentTimeS >= chapter.startS && currentTimeS < chapter.endS;
          const fill = isCompleted ? 1 : isActive
            ? (currentTimeS - chapter.startS) / segDuration : 0;

          return (
            <div key={chapter.label} style={{
              width: `${widthPct}%`, height: "100%", position: "relative",
              backgroundColor: COLORS.unfilled,
              borderRight: i < chapters.length - 1 ? `2px solid ${COLORS.divider}` : "none",
              overflow: "hidden",
            }}>
              {/* 填充进度 */}
              <div style={{
                position: "absolute", top: 0, left: 0,
                width: `${fill * 100}%`, height: "100%",
                backgroundColor: COLORS.filled,
              }} />
              {/* 章节名：两行 */}
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 1, overflow: "hidden", userSelect: "none",
              }}>
                <div style={{
                  fontFamily, fontSize: 15, fontWeight: "700",
                  color: COLORS.text, letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}>
                  {chapter.label}
                </div>
                {chapter.sub && (
                  <div style={{
                    fontFamily, fontSize: 12, fontWeight: "400",
                    color: COLORS.text, letterSpacing: "0.03em",
                    whiteSpace: "nowrap", opacity: 0.8,
                  }}>
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
