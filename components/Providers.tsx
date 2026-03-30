"use client";

import { Provider } from "react-redux";
import store from "../store";
import { useEffect } from "react";
import { AuthUser } from "@/app/types";
import { connectSocket } from "../lib/socket";

export default function Providers({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AuthUser | null;
}) {
  useEffect(() => {
    if (user) {
      connectSocket();
    }
  }, [user]);

  return <Provider store={store}>{children}</Provider>;
}
