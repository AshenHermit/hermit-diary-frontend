"use client";

import { TabKey } from "@/app/diary/[diary_code]/control-panel/diary-layout";
import {
  getDiary,
  getDiaryWritePermission,
} from "@/services/methods/user/diaries";
import { getDiaryNote, getDiaryNotes } from "@/services/methods/user/notes";
import { Diary } from "@/services/types/diary";
import { DiaryNote, VerboseNote } from "@/services/types/notes";
import React from "react";
import { createStore, StoreApi, useStore } from "zustand";

export type DiaryProps = Diary & {
  writePermission: boolean;
  loaded: boolean;
  loadDiary: (diaryCode: string) => Promise<void>;
  loadNotes: () => Promise<void>;
  currentTab: TabKey;
  setCurrentTab: (key: TabKey) => void;
  notes: DiaryNote[];
  selectedNote: DiaryNote | null;
  setSelectedNote: (note: DiaryNote | null) => void;
};

export const defaultDiary: Diary = {
  id: -1,
  isPublic: true,
  name: "untitled",
  picture: "",
};

const createDiaryStore = () => {
  return createStore<DiaryProps>((set, get) => ({
    ...defaultDiary,
    ...{
      selectedNote: null,
      setSelectedNote(note) {
        set({ selectedNote: note });
      },
      writePermission: false,
      loaded: false,
      notes: [],
      currentTab: "notes",
      setCurrentTab(tab) {
        set({ currentTab: tab });
      },
      async loadDiary(diaryCode) {
        try {
          const diary = await getDiary(diaryCode);
          const writePermission = await getDiaryWritePermission(diaryCode);
          const notes = await getDiaryNotes(diary.id);
          let selectedNote = get().selectedNote;
          if (selectedNote) {
            let newNoteSelection = notes.filter(
              (note) => note.id == selectedNote?.id,
            );
            if (newNoteSelection.length > 0) selectedNote = newNoteSelection[0];
            else selectedNote = null;
          }
          set({
            ...diary,
            notes,
            writePermission,
            loaded: true,
            selectedNote: selectedNote,
          });
        } catch (e) {
          set({ loaded: true });
        }
      },
      async loadNotes() {
        try {
          const notes = await getDiaryNotes(get().id);
          set({ notes });
        } catch (e) {}
      },
    },
  }));
};
export type HeaderStore = ReturnType<typeof createDiaryStore>;

const DiaryStoreContext = React.createContext<HeaderStore | null>(null);

export function DiaryStoreProvider({ children }: React.PropsWithChildren) {
  const [state] = React.useState(() => createDiaryStore());
  return (
    <DiaryStoreContext.Provider value={state}>
      {children}
    </DiaryStoreContext.Provider>
  );
}

export function useDiaryStore<T>(selector: (state: DiaryProps) => T): T {
  const store = React.useContext(DiaryStoreContext);
  if (!store) throw new Error("Missing DiaryStoreContext.Provider in the tree");
  return useStore(store, selector);
}

export function useDiaryNote(noteId: number | undefined, dependencies: any[]) {
  const [note, setNote] = React.useState<VerboseNote | null>(null);

  const loadNote = React.useCallback(async () => {
    if (!noteId) return;
    const fetchedNote = await getDiaryNote(noteId);
    setNote(fetchedNote);
  }, [noteId]);

  React.useEffect(() => {
    loadNote();
  }, [loadNote, ...dependencies]);

  return { note };
}
