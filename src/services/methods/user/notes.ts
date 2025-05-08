import { Diary } from "@/services/types/diary";
import { DiaryNote } from "@/services/types/notes";
import { apiClient } from "@services/api-client/client-api";

export async function addDiaryNote(diaryId: number) {
  return await apiClient.post<DiaryNote, {}>(`diaries/${diaryId}/notes`);
}

export async function getDiaryNotes(diaryId: number) {
  return await apiClient.get<DiaryNote[], {}>(`notes`, {
    diaryId: diaryId,
  });
}

export async function deleteDiaryNote(note: DiaryNote) {
  return await apiClient.delete<boolean, {}>(`notes/${note.id}`);
}
