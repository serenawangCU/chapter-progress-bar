import { loadFont } from "@remotion/google-fonts/NotoSansSC";
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const { fontFamily } = loadFont("normal", { weights: ["700"] });

const TOTAL_DURATION_S = 300;

const chapters = [
  { label: "开场",  sub: "", startS: 0,   endS: 60  },
  { label: "第一章", sub: "", startS: 60,  endS: 120 },
  { label: "第二章", sub: "", startS: 120, endS: 210 },
  { label: "第三章", sub: "", startS: 210, endS: 270 },
  { label: "结尾",  sub: "", startS: 270, endS: 300 },
];

const COLORS = {
  filled:   "#E8738A",
  unfilled: "#F5C0CC",
  divider:  "#E09AAA",
  text:     "#7A2040",
  shadow:   "rgba(150, 50, 80, 0.15)",
};

const BAR_HEIGHT = 60;
const BAR_OPACITY = 0.88;
const CRAB_W = 90;
const CRAB_H = 67;

const C = {
  body: "#E8738A",
  dark: "#C45070",
  eye: "#FFFFFF",
  pupil: "#1A0A08",
};

const MiniCrab: React.FC<{ legPhase: number }> = ({ legPhase }) => {
  const l1 = Math.sin(legPhase) * 28;
  const l2 = Math.sin(legPhase + (Math.PI * 2) / 3) * 28;
  const l3 = Math.sin(legPhase + (Math.PI * 4) / 3) * 28;

  const leftLegs = [
    { angle: l1, px: 50, py: 68 },
    { angle: l2, px: 42, py: 72 },
    { angle: l3, px: 34, py: 74 },
  ];
  const rightLegs = [
    { angle: -l1, px: 110, py: 68 },
    { angle: -l2, px: 118, py: 72 },
    { angle: -l3, px: 126, py: 74 },
  ];

  return (
    <svg viewBox="0 0 160 120" width={CRAB_W} height={CRAB_H}>
      {leftLegs.map((leg, i) => (
        <g key={i} transform={`rotate(${-30 + leg.angle}, ${leg.px}, ${leg.py})`}>
          <path d={`M ${leg.px} ${leg.py} C ${leg.px - 10} ${leg.py - 2}, ${leg.px - 20} ${leg.py + 15}, ${leg.px - 15} ${leg.py + 28}`}
            fill="none" stroke={C.body} strokeWidth={6} strokeLinecap="round" />
        </g>
      ))}
      {rightLegs.map((leg, i) => (
        <g key={i} transform={`rotate(${30 + leg.angle}, ${leg.px}, ${leg.py})`}>
          <path d={`M ${leg.px} ${leg.py} C ${leg.px + 10} ${leg.py - 2}, ${leg.px + 20} ${leg.py + 15}, ${leg.px + 15} ${leg.py + 28}`}
            fill="none" stroke={C.body} strokeWidth={6} strokeLinecap="round" />
        </g>
      ))}
      <ellipse cx="80" cy="72" rx="42" ry="28" fill={C.body} />
      <ellipse cx="80" cy="67" rx="28" ry="16" fill={C.dark} opacity={0.2} />
      <line x1="50" y1="65" x2="30" y2="52" stroke={C.body} strokeWidth={6} strokeLinecap="round" />
      <g transform="translate(15, 37) rotate(-35)">
        <path d="M 0 2 L -11 -11 A 15.5 15.5 0 1 0 11 -11 Z" fill={C.body} stroke={C.body} strokeWidth={3} strokeLinejoin="round" />
      </g>
      <line x1="110" y1="65" x2="130" y2="52" stroke={C.body} strokeWidth={6} strokeLinecap="round" />
      <g transform="translate(145, 37) rotate(35)">
        <path d="M 0 2 L -11 -11 A 15.5 15.5 0 1 0 11 -11 Z" fill={C.body} stroke={C.body} strokeWidth={3} strokeLinejoin="round" />
      </g>
      <rect x="59" y="42" width="7" height="16" rx="3.5" fill={C.body} />
      <rect x="94" y="42" width="7" height="16" rx="3.5" fill={C.body} />
      <circle cx="62" cy="38" r="11" fill={C.eye} />
      <circle cx="97" cy="38" r="11" fill={C.eye} />
      <circle cx="64" cy="40" r="6" fill={C.pupil} />
      <circle cx="99" cy="40" r="6" fill={C.pupil} />
      <circle cx="66" cy="37" r="2.5" fill={C.eye} />
      <circle cx="101" cy="37" r="2.5" fill={C.eye} />
      <path d="M 67 80 Q 80 90 93 80" stroke={C.dark} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
};

export const CrabProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeS = frame / fps;

  const cyclePeriod = 12;
  const legPhase = (frame / cyclePeriod) * Math.PI * 2;
  const bounce = Math.abs(Math.sin(legPhase / 2)) * 4;

  // 螃蟹 x 跟着播放进度走
  const progress = currentTimeS / TOTAL_DURATION_S;
  const rawX = progress * 1920 - CRAB_W / 2;
  const crabX = Math.max(0, Math.min(1920 - CRAB_W, rawX));

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {/* 底部阴影 */}
      <div style={{
        position: "absolute", top: BAR_HEIGHT, left: 0, right: 0, height: 8,
        background: `linear-gradient(to bottom, ${COLORS.shadow}, transparent)`,
      }} />

      {/* 进度条 */}
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
              <div style={{
                position: "absolute", top: 0, left: 0,
                width: `${fill * 100}%`, height: "100%",
                backgroundColor: COLORS.filled,
              }} />
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 1, overflow: "hidden", userSelect: "none",
              }}>
                <div style={{
                  fontFamily, fontSize: 15, fontWeight: "700",
                  color: COLORS.text, letterSpacing: "0.04em", whiteSpace: "nowrap",
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

      {/* 小螃蟹骑在进度条上 */}
      <div style={{
        position: "absolute",
        left: crabX,
        top: BAR_HEIGHT - bounce,
      }}>
        <MiniCrab legPhase={legPhase} />
      </div>
    </AbsoluteFill>
  );
};
