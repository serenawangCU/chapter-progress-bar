import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansSC";

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
  filled: "#C09070",
  unfilled: "#EDE4D4",
  text: "#4A3220",
};

const BAR_HEIGHT = 120;

export const DashProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeS = frame / fps;

  return (
    <AbsoluteFill style={{ background: "transparent", justifyContent: "flex-start" }}>
      <div style={{
        width: "100%",
        height: BAR_HEIGHT,
        position: "relative",
        paddingTop: 16, // 稍微往下一点点
      }}>
        {chapters.map((chapter) => {
          const segDuration = chapter.endS - chapter.startS;
          // 根据真实时间比例计算每个破折号的位置和宽度
          const leftPct = (chapter.startS / TOTAL_DURATION_S) * 100;
          const widthPct = (segDuration / TOTAL_DURATION_S) * 100;

          const isCompleted = currentTimeS >= chapter.endS;
          const isActive = currentTimeS >= chapter.startS && currentTimeS < chapter.endS;
          const fill = isCompleted ? 1 : isActive
            ? (currentTimeS - chapter.startS) / segDuration : 0;

          return (
            <div key={chapter.label} style={{
              position: "absolute",
              left: `${leftPct}%`,
              width: `${widthPct}%`,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start", // 线条在上，文字在下
              gap: 16,
              padding: "0 8px", // 给破折号之间留出一点空隙
            }}>
              {/* 破折号线条容器 */}
              <div style={{
                width: "100%",
                height: 6,
                backgroundColor: COLORS.unfilled,
                borderRadius: 3,
                overflow: "hidden",
                position: "relative",
                marginTop: 0, // 移除 marginTop，让线条紧贴顶部
              }}>
                {/* 填充层 */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: `${fill * 100}%`,
                  backgroundColor: COLORS.filled,
                }} />
              </div>

              {/* 章节文字 */}
              <div style={{
                fontFamily,
                fontSize: 20, // 稍微缩小一点，因为章节有 10 个
                fontWeight: "700", // 和 ChapterProgressBar 保持一致
                letterSpacing: "0.04em", // 和 ChapterProgressBar 保持一致
                color: isCompleted || isActive ? COLORS.text : COLORS.unfilled,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%", // 防止文字超出段落宽度
              }}>
                {chapter.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
