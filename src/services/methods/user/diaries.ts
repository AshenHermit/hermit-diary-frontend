import { Diary } from "@/services/types/diary";
import { apiClient } from "@services/api-client/client-api";
import { User } from "@services/types/user";

export async function getUserDiaries(userId: number) {
  return await apiClient.get<Diary[], {}>(`users/${userId}/diaries`);
}

export async function addUserDiary(userId: number) {
  return await apiClient.post<Diary, {}>(`users/${userId}/diaries`);
}

export async function updateUserDiary(userId: number, data: Diary) {
  return await apiClient.patch<boolean, Diary>(
    `users/${userId}/diaries/${data.id}`
  );
}

export async function deleteUserDiary(userId: number, data: Diary) {
  return await apiClient.delete<boolean, Diary>(
    `users/${userId}/diaries/${data.id}`
  );
}
