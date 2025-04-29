"use client";

import { HorizontalDivider } from "@/components/ui/horizontal-divider";
import { useUserDiaries } from "@/hooks/api-hooks";
import { Diary } from "@/services/types/diary";
import { useUserStore } from "@/store/user-store";
import { CircleDotDashed, CircleFadingPlus } from "lucide-react";
import React from "react";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 h-full p-8">
      <HorizontalDivider>Diaries</HorizontalDivider>
      <DiariesList />
    </div>
  );
}

function DiariesList() {
  const userLoaded = useUserStore((state) => state.loaded);
  const userId = useUserStore((state) => state.id);
  const { diaries, loadDiaries, addDiary } = useUserDiaries(
    userLoaded ? userId : undefined
  );

  return (
    <div className="grid grid-cols-4 gap-4">
      {diaries.map((diary) => (
        <DiaryCard diary={diary} />
      ))}
      <AddNewDiaryCard onClick={addDiary} />
    </div>
  );
}

function DiaryCard({
  diary,
  onUpdate,
}: {
  diary: Diary;
  onUpdate?: () => void;
}) {
  return (
    <div className="h-[200px] bg-muted grid grid-rows-[1fr_auto] rounded-2xl overflow-hidden transition-all hover:scale-105">
      <div className="flex justify-center items-center bg-sidebar cursor-pointer">
        <CircleDotDashed />
      </div>
      <div className="border-t-2 border-gray-950 p-4">{diary.name}</div>
    </div>
  );
}

function AddNewDiaryCard(props: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className="cursor-pointer transition-all hover:scale-105 text-muted h-[200px] flex gap-4 justify-center flex-col items-center rounded-2xl overflow-hidden border-dashed border-2 border-muted"
    >
      <CircleFadingPlus />
      <div>new diary</div>
    </div>
  );
}
