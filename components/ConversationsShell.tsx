"use client";

import { useParams, usePathname } from "next/navigation";

export default function ConversationsShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const { roomId } = useParams();
  const pathname = usePathname();
  const hasActiveRoom = !!roomId || pathname.endsWith("/new");

  return (
    <>
      <div
        className={`bg-surface border-accent/20 flex flex-col gap-2 overflow-hidden border-r ${hasActiveRoom ? "hidden md:flex md:w-64 lg:w-80" : "flex w-full md:w-64 lg:w-80"}`}
      >
        {sidebar}
      </div>
      <div
        className={`min-w-0 ${hasActiveRoom ? "flex flex-1" : "hidden flex-1 md:flex"}`}
      >
        {children}
      </div>
    </>
  );
}
