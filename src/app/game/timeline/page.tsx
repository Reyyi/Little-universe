import { TimelineGame } from "@/components/game/TimelineGame";
import { ChapterGate } from "@/components/shell/ChapterGate";

export default function TimelinePage() {
  return (
    <ChapterGate id="game">
      <TimelineGame />
    </ChapterGate>
  );
}
