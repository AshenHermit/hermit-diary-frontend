"use client";

import { useDiaryStore } from "@/app/(diary-view)/diary/[diary_code]/diary-store";
import { NotesGraph } from "@/components/visualization/notes-graph/notes-graph";
import { DiaryNote } from "@/services/types/notes";

export default function Page() {
  const notes = useDiaryStore((state) => state.notes);
  const activeNote = useDiaryStore((state) => state.selectedNote);
  const setSelectedNote = useDiaryStore((state) => state.setSelectedNote);
  const setCurrentTab = useDiaryStore((state) => state.setCurrentTab);

  const onSelectedNote = (note: DiaryNote) => {
    setSelectedNote(note);
    setCurrentTab("post");
  };

  return (
    <div className="relative">
      <NotesGraph
        notes={notes}
        onNoteSelected={onSelectedNote}
        activeNoteId={activeNote?.id}
      />
    </div>
  );
}
