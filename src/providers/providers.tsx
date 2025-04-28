"use client";

import { useUserStore } from "@store/user-store";
import React from "react";

export function UserProvider() {
  const setUser = useUserStore((state) => state.setUser);
  const loadUser = useUserStore((state) => state.loadUser);

  React.useEffect(() => {
    loadUser();
  }, [loadUser]);
  return null;
}

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <>
      <UserProvider />
      {children}
    </>
  );
}
