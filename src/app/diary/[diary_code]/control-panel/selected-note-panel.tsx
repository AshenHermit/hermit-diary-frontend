"use client";

import { DiaryTabPanel } from "@/app/diary/[diary_code]/control-panel/panel";
import {
  useDiaryNote,
  useDiaryStore,
} from "@/app/diary/[diary_code]/diary-store";
import { NoteFrame } from "@/components/note-editor/note-frame";
import { LoadingSpinner } from "@/components/ui/spinner";
import React from "react";

export function SelectedNotePanel() {
  const loadNotes = useDiaryStore((state) => state.loadNotes);
  const selectedNote = useDiaryStore((state) => state.selectedNote);
  const writePermission = useDiaryStore((state) => state.writePermission);

  const [editMode, setEditMode] = React.useState(false);
  const { note } = useDiaryNote(selectedNote?.id, []);

  if (!selectedNote) {
    return (
      <DiaryTabPanel className="h-full">
        <div className="flex h-full flex-col items-center justify-center">
          no note selected
        </div>
      </DiaryTabPanel>
    );
  }

  if (selectedNote && !note) {
    return (
      <DiaryTabPanel className="h-full">
        <div className="flex h-full flex-col items-center justify-center">
          <LoadingSpinner />
        </div>
      </DiaryTabPanel>
    );
  }

  if (note) {
    return (
      <DiaryTabPanel className="h-full">
        <NoteFrame
          note={note}
          config={{
            canEdit: writePermission,
            onNoteUpdate: () => loadNotes(),
            editMode,
            defaultEditMode: editMode,
            setEditMode,
          }}
        />
      </DiaryTabPanel>
    );
  }

  return null;
}
