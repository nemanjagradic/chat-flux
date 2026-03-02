"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa6";
import { FaBell } from "react-icons/fa";
import { FaMobileAlt } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

export default function SettingsSidebar() {
  const pathname = usePathname();
  const settingsSidebarItems = [
    {
      title: "Profile",
      link: "profile",
      icon: FaUser,
    },
    { title: "Account", link: "account", icon: FaKey },
    { title: "Notifications", link: "notifications", icon: FaBell },
    { title: "Sessions", link: "sessions", icon: FaMobileAlt },
    { title: "Danger Zone", link: "danger", icon: FaTriangleExclamation },
  ];

  return (
    <div className="bg-surface border-accent/20 flex flex-col border-r">
      {settingsSidebarItems.map((item) => {
        return (
          <Link
            key={item.title}
            href={`/settings/${item.link}`}
            className={`${pathname.startsWith(`/settings/${item.link}`) ? "bg-panel2" : "transparent"} flex items-center p-5 transition-colors ${
              pathname.startsWith(`/settings/${item.link}`)
                ? "bg-accent/15 text-accent border-accent border-l-4"
                : "text-muted hover:text-text hover:bg-accent/7"
            }`}
          >
            <item.icon
              size={20}
              className={`mr-4 ${
                pathname.startsWith(`/settings/${item.link}`)
                  ? "text-white"
                  : "text-muted"
              } `}
            />
            {item.title}
          </Link>
        );
      })}
    </div>
  );
}
