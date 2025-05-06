import { DiaryLayout } from "@/app/diary/[diary_code]/control-panel/diary-layout";
import { DiaryStoreProvider } from "@/app/diary/[diary_code]/diary-store";

export default async function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="mx-auto h-full w-full">
      {
        <DiaryStoreProvider>
          <DiaryLayout>{children}</DiaryLayout>
        </DiaryStoreProvider>
      }
    </div>
  );
}
