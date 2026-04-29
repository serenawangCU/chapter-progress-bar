import "./index.css";
import { Composition } from "remotion";
import { ChapterProgressBar } from "./ChapterProgressBar";

// 视频：15分45秒 = 945秒 × 30fps = 28350 帧
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ChapterProgressBar"
        component={ChapterProgressBar}
        durationInFrames={28350}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
