import { Diary } from "@/services/types/diary";

export type DiaryNote = {
  id: number;
  name: string;
  isPublic: boolean;
};

export type GlobalNote = DiaryNote & {
  diary: Diary;
};

export type VerboseNote = GlobalNote & {
  content: Record<string, any>;
};
