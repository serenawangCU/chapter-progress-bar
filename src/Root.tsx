import "./index.css";
import { Composition, CalculateMetadataFunction } from "remotion";
import { ChapterProgressBar } from "./progress-bars/ChapterProgressBar";
import { ChapterProgressBarBottom } from "./progress-bars/ChapterProgressBarBottom";
import { ChapterProgressBarPortrait } from "./progress-bars/ChapterProgressBarPortrait";
import { CrabProgressBar } from "./progress-bars/CrabProgressBar";
import { TextHighlightProgressBar } from "./progress-bars/TextHighlightProgressBar";
import { DashProgressBar } from "./progress-bars/DashProgressBar";
import { MinimalProgressBar } from "./progress-bars/MinimalProgressBar";
import { KyomiProgressBar } from "./progress-bars/KyomiProgressBar";

const alphaMeta: CalculateMetadataFunction<Record<string, unknown>> = async () => ({
  defaultCodec: "prores",
  defaultVideoImageFormat: "png",
  defaultPixelFormat: "yuva444p10le",
  defaultProResProfile: "4444",
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ChapterProgressBar"
        component={ChapterProgressBar}
        durationInFrames={300 * 30}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={alphaMeta}
      />

      <Composition
        id="ChapterProgressBarBottom"
        component={ChapterProgressBarBottom}
        durationInFrames={663 * 30}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={alphaMeta}
      />

      <Composition
        id="ChapterProgressBarPortrait"
        component={ChapterProgressBarPortrait}
        durationInFrames={300 * 30}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={alphaMeta}
      />

      <Composition
        id="CrabProgressBar"
        component={CrabProgressBar}
        durationInFrames={300 * 30}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={alphaMeta}
      />

      <Composition
        id="TextHighlightProgressBar"
        component={TextHighlightProgressBar}
        durationInFrames={300 * 30}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={alphaMeta}
      />

      <Composition
        id="DashProgressBar"
        component={DashProgressBar}
        durationInFrames={300 * 30}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={alphaMeta}
      />

      <Composition
        id="MinimalProgressBar"
        component={MinimalProgressBar}
        durationInFrames={300 * 30}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={alphaMeta}
      />

      <Composition
        id="KyomiProgressBar"
        component={KyomiProgressBar}
        durationInFrames={300 * 30}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={alphaMeta}
      />
    </>
  );
};
