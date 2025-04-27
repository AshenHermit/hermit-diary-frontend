"use client";

import {
  FileExtensions,
  FileType,
  FileUploader,
  UploadedFile,
} from "@/components/controls/file-uploader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/services/methods/user/user";
import { useLocalUserPicture, useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page() {
  const picture = useLocalUserPicture();
  const loadUser = useUserStore((state) => state.loadUser);
  const uploadRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [isLoadingImages, setIsLoadingImages] = React.useState(false);
  const onUpload = React.useCallback(async (files: UploadedFile[]) => {
    if (files.length > 0) {
      const file = files[0];
      await updateProfile({ picture: file.url });
      loadUser();
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 px-2 bg-muted rounded-lg text-muted-foreground w-full">
          Profile picture
        </span>
      </div>
      <div className="flex items-center justify-center" ref={uploadRef}>
        <FileUploader
          types={[FileType.Image]}
          onUpload={onUpload}
          areaRef={uploadRef}
          onLoadingStateChange={setIsLoadingImages}
        >
          <div className="flex flex-col items-center gap-2">
            <Avatar className="w-32 h-32">
              <AvatarImage src={picture}></AvatarImage>
            </Avatar>
            <Button variant="default" className="-mt-8 z-10">
              edit
            </Button>
          </div>
        </FileUploader>
      </div>
      <div className="mt-8 relative w-full text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 px-2 bg-muted rounded-lg text-muted-foreground w-full">
          Info
        </span>
      </div>
    </div>
  );
}
