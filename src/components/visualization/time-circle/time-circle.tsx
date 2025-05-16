"use client";

import { DiaryNote } from "@/services/types/notes";

export type NotesCircleProps = {
  notes: DiaryNote[];
  onNoteSelected: (note: DiaryNote) => void;
  activeNoteId?: number | null;
  accentColor?: string;
};

export function TimeCircle({
  notes,
  onNoteSelected,
  activeNoteId,
  accentColor,
}: NotesCircleProps) {
  return (
    <div>
      {notes.map((x) => (
        <div>{x.name}</div>
      ))}
    </div>
  );
}
