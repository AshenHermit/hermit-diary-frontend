"use client";

import { getProfile } from "@services/methods/user/user";
import { useUserStore } from "@store/user-store";
import { SessionProvider } from "next-auth/react";
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
