import { BeginningStory } from "@/components/story/BeginningStory";
import { ChapterGate } from "@/components/shell/ChapterGate";

export default function BeginningPage() {
  return (
    <ChapterGate id="beginning">
      <BeginningStory />
    </ChapterGate>
  );
}
