import { Diary } from "@/services/types/diary";
import { apiClient } from "@services/api-client/client-api";
import { User } from "@services/types/user";

export async function getUserDiaries(userId: number) {
  return await apiClient.get<Diary[], {}>(`users/${userId}/diaries`);
}

export async function getDiary(diaryId: number) {
  return await apiClient.get<Diary, {}>(`diaries/${diaryId}`);
}

export async function getDiaryWritePermission(diaryId: number) {
  return await apiClient.get<boolean, {}>(
    `diaries/${diaryId}/write_permission`,
  );
}

export async function addUserDiary(userId: number) {
  return await apiClient.post<Diary, {}>(`users/${userId}/diaries`);
}

export async function updateDiary(data: Partial<Diary>) {
  return await apiClient.patch<boolean, Partial<Diary>>(
    `diaries/${data.id}`,
    data,
  );
}

export async function deleteDiary(data: Diary) {
  return await apiClient.delete<boolean, undefined>(`diaries/${data.id}`);
}
