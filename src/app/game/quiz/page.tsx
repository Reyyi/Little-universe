import { QuizGame } from "@/components/game/QuizGame";
import { ChapterGate } from "@/components/shell/ChapterGate";

export default function QuizPage() {
  return (
    <ChapterGate id="game">
      <QuizGame />
    </ChapterGate>
  );
}
