"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  IoChatbubbleOutline,
  IoPeopleOutline,
  IoStarOutline,
  IoSettingsOutline,
} from "react-icons/io5";

export default function Sidebar() {
  const pathname = usePathname();
  const { roomId } = useParams();
  const hasActiveRoom = !!roomId;

  const sidebarItems = [
    {
      title: "conversations",
      icon: IoChatbubbleOutline,
    },
    { title: "groups", icon: IoPeopleOutline },
    { title: "starred", icon: IoStarOutline },
    { title: "settings", icon: IoSettingsOutline },
  ];

  return (
    <div
      className={`${hasActiveRoom ? "xs:w-20 hidden w-14 md:flex" : "xs:w-20 flex w-14"} bg-sidebar border-accent/20 flex shrink-0 flex-col items-center gap-y-4 border-r py-4`}
    >
      <h1 className="text-accent text-3xl font-extrabold">C</h1>
      {sidebarItems.map((item) => {
        return (
          <Link
            key={item.title}
            href={`${item.title.startsWith("settings") ? `/${item.title}/profile` : `/${item.title}`}`}
            className={`xs:h-12 xs:w-12 flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              pathname.startsWith(`/${item.title}`)
                ? "bg-accent/15 text-accent"
                : "text-muted hover:text-text hover:bg-accent/7"
            }`}
          >
            <item.icon
              className={`h-4.5 w-4.5 sm:h-5 sm:w-5 ${
                pathname.startsWith(`/${item.title}`)
                  ? "text-white"
                  : "text-muted"
              }`}
            />
          </Link>
        );
      })}
    </div>
  );
}
