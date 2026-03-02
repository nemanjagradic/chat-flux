"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoChatbubbleOutline,
  IoPeopleOutline,
  IoStarOutline,
  IoSettingsOutline,
} from "react-icons/io5";

export default function Sidebar() {
  const pathname = usePathname();
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
    <div className="bg-sidebar border-accent/20 flex w-20 flex-col items-center gap-y-4 border-r py-4">
      <h1 className="text-accent text-3xl font-extrabold">C</h1>
      {sidebarItems.map((item) => {
        return (
          <Link
            key={item.title}
            href={`${item.title.startsWith("settings") ? `/${item.title}/profile` : `/${item.title}`}`}
            className={`flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${
              pathname.startsWith(`/${item.title}`)
                ? "bg-accent/15 text-accent"
                : "text-muted hover:text-text hover:bg-accent/7"
            }`}
          >
            <item.icon
              size={20}
              className={
                pathname.startsWith(`/${item.title}`)
                  ? "text-white"
                  : "text-muted"
              }
            />
          </Link>
        );
      })}
    </div>
  );
}
