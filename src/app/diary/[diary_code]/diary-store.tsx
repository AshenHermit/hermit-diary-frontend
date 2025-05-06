"use client";

import {
  getDiary,
  getDiaryWritePermission,
} from "@/services/methods/user/diaries";
import { Diary } from "@/services/types/diary";
import React from "react";
import { createStore, StoreApi, useStore } from "zustand";

export type DiaryProps = Diary & {
  writePermission: boolean;
  loaded: boolean;
  loadDiary: (diaryCode: string) => Promise<void>;
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
      async loadDiary(diaryCode) {
        try {
          const diary = await getDiary(diaryCode);
          const writePermission = await getDiaryWritePermission(diaryCode);
          set({ ...diary, writePermission, loaded: true });
        } catch (e) {
          set({ loaded: true });
        }
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
