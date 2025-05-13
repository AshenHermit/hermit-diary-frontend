import { Diary } from "@/services/types/diary";

export type NoteBase = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  isPublic: boolean;
};

export type DiaryNote = NoteBase & {
  id: number;
  name: string;
  isPublic: boolean;
  incomingLinks: NoteBase[];
  outcomingLinks: NoteBase[];
};

export type GlobalNote = DiaryNote & {
  diary: Diary;
};

export type VerboseNote = GlobalNote & {
  content: Record<string, any>;
};
