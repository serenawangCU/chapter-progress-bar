import { loadFont } from "@remotion/google-fonts/NotoSansSC";
import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import kyomiHeadStroke from "./assets/kyomi_smile_head_stroke.png";

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

const BAR_HEIGHT = 52;
const BAR_OPACITY = 0.82;
const HEAD_H = 46;
const HEAD_W = Math.round(HEAD_H * (359 / 294));
const CANVAS_W = 1920;

export const KyomiProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeS = frame / fps;

  const progress = Math.min(1, currentTimeS / TOTAL_DURATION_S);
  const fillEdgeX = progress * CANVAS_W;
  const headX = Math.max(0, Math.min(CANVAS_W - HEAD_W, fillEdgeX));
  const headY = (BAR_HEIGHT - HEAD_H) / 2;

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
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: BAR_OPACITY,
          }}
        >
        {chapters.map((chapter, i) => {
          const segDuration = chapter.endS - chapter.startS;
          const widthPct = (segDuration / TOTAL_DURATION_S) * 100;
          const isCompleted = currentTimeS >= chapter.endS;
          const isActive =
            currentTimeS >= chapter.startS && currentTimeS < chapter.endS;
          const fill = isCompleted
            ? 1
            : isActive
              ? (currentTimeS - chapter.startS) / segDuration
              : 0;

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
                    ? `2px solid ${COLORS.divider}`
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
                  gap: 1,
                  overflow: "hidden",
                  userSelect: "none",
                }}
              >
                <div
                  style={{
                    fontFamily,
                    fontSize: 15,
                    fontWeight: "700",
                    color: COLORS.text,
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {chapter.label}
                </div>
                {chapter.sub && (
                  <div
                    style={{
                      fontFamily,
                      fontSize: 12,
                      fontWeight: "400",
                      color: COLORS.text,
                      letterSpacing: "0.03em",
                      whiteSpace: "nowrap",
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

        <div
          style={{
            position: "absolute",
            left: headX,
            top: headY,
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <Img
            src={kyomiHeadStroke}
            style={{
              width: HEAD_W,
              height: HEAD_H,
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
