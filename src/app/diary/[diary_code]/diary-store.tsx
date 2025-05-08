"use client";

import {
  getDiary,
  getDiaryWritePermission,
} from "@/services/methods/user/diaries";
import { getDiaryNotes } from "@/services/methods/user/notes";
import { Diary } from "@/services/types/diary";
import { DiaryNote } from "@/services/types/notes";
import React from "react";
import { createStore, StoreApi, useStore } from "zustand";

export type DiaryProps = Diary & {
  writePermission: boolean;
  loaded: boolean;
  loadDiary: (diaryCode: string) => Promise<void>;
  loadNotes: () => Promise<void>;
  notes: DiaryNote[];
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
      writePermission: false,
      loaded: false,
      notes: [],
      async loadDiary(diaryCode) {
        try {
          const diary = await getDiary(diaryCode);
          const writePermission = await getDiaryWritePermission(diaryCode);
          const notes = await getDiaryNotes(diary.id);
          set({ ...diary, notes, writePermission, loaded: true });
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
