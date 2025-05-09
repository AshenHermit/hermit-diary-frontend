"use client";

import { useDiaryStore } from "@/app/(diary-view)/diary/[diary_code]/diary-store";
import { NotesGraph } from "@/components/visualization/notes-graph/notes-graph";

export default function Page() {
  const notes = useDiaryStore((state) => state.notes);
  return (
    <div className="relative">
      <NotesGraph notes={notes} />
    </div>
  );
}
