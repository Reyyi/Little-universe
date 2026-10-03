import { MemoriesGallery } from "@/components/memories/MemoriesGallery";
import { ChapterGate } from "@/components/shell/ChapterGate";

export default function MemoriesPage() {
  return (
    <ChapterGate id="memories">
      <MemoriesGallery />
    </ChapterGate>
  );
}
