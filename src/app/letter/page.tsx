import { LetterScene } from "@/components/letter/LetterScene";
import { ChapterGate } from "@/components/shell/ChapterGate";

export default function LetterPage() {
  return (
    <ChapterGate id="letter">
      <LetterScene />
    </ChapterGate>
  );
}
