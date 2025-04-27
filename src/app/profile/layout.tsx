import { ProfileRedirectComponent } from "@/app/profile/redirect";
import { SidebarProfileLayout } from "@/app/profile/sidebar-layout";
import { Suspense } from "react";

export default function ProfileLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="max-w-[1300px] mx-auto py-4 h-full">
      <ProfileRedirectComponent />
      <Suspense>
        <SidebarProfileLayout>{children}</SidebarProfileLayout>
      </Suspense>
    </div>
  );
}
