import { FindGame } from "@/components/game/FindGame";
import { ChapterGate } from "@/components/shell/ChapterGate";

export default function FindPage() {
  return (
    <ChapterGate id="game">
      <FindGame />
    </ChapterGate>
  );
}
