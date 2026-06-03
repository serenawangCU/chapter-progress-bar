import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const TOTAL_DURATION_S = 300;

const chapters = [
  { label: "开场",  sub: "", startS: 0,   endS: 60  },
  { label: "第一章", sub: "", startS: 60,  endS: 120 },
  { label: "第二章", sub: "", startS: 120, endS: 210 },
  { label: "第三章", sub: "", startS: 210, endS: 270 },
  { label: "结尾",  sub: "", startS: 270, endS: 300 },
];

const COLORS = {
  filled: "#C09070",   // 对应 ChapterProgressBar 的 filled
  unfilled: "#EDE4D4", // 对应 ChapterProgressBar 的 unfilled
};

const BAR_HEIGHT = 120;

export const MinimalProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeS = frame / fps;

  return (
    <AbsoluteFill style={{ background: "transparent", justifyContent: "flex-start" }}>
      <div style={{
        width: "100%",
        height: BAR_HEIGHT,
        position: "relative",
        display: "flex",
        alignItems: "center",
        paddingTop: 0, // 移除 paddingTop
        marginTop: -40, // 调整 marginTop，让它和 DashProgressBar 的线条 Y 轴位置差不多
      }}>
        {/* 整体进度条容器 - 宽度 100%，从屏幕最左边开始 */}
        <div style={{
          width: "100%",
          height: 6,
          backgroundColor: COLORS.unfilled,
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}>
          {/* 填充层 */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${Math.max(0, Math.min(100, (currentTimeS / TOTAL_DURATION_S) * 100))}%`,
            backgroundColor: COLORS.filled,
            zIndex: 1,
          }} />

          {/* 节点 (圆点) */}
          {chapters.map((chapter, i) => {
            // 节点的位置严格按照该章节的开始时间在总时间中的比例来计算
            const positionPct = (chapter.startS / TOTAL_DURATION_S) * 100;
            // 当当前时间到达或超过该节点的开始时间时，节点变色
            const isCompleted = currentTimeS >= chapter.startS;

            return (
              <div key={i} style={{
                position: "absolute",
                left: `${positionPct}%`,
                transform: "translateX(-50%)",
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: isCompleted ? COLORS.filled : COLORS.unfilled,
                zIndex: 2,
              }} />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
