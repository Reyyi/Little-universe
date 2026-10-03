import { GameHub } from "@/components/game/GameHub";
import { ChapterGate } from "@/components/shell/ChapterGate";

export default function GamePage() {
  return (
    <ChapterGate id="game">
      <GameHub />
    </ChapterGate>
  );
}
