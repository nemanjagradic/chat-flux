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
    <>
      <div className="bg-surface border-accent/20 hidden flex-col border-r lg:flex">
        {settingsSidebarItems.map((item) => (
          <Link
            key={item.title}
            href={`/settings/${item.link}`}
            className={`flex items-center p-5 transition-colors ${
              pathname.startsWith(`/settings/${item.link}`)
                ? "border-accent bg-accent/15 text-accent border-l-4"
                : "text-muted hover:bg-accent/7 hover:text-text"
            }`}
          >
            <item.icon
              size={20}
              className={`mr-4 ${pathname.startsWith(`/settings/${item.link}`) ? "text-white" : "text-muted"}`}
            />
            {item.title}
          </Link>
        ))}
      </div>

      <div className="bg-surface border-accent/20 flex overflow-x-auto border-b lg:hidden">
        {settingsSidebarItems.map((item) => (
          <Link
            key={item.title}
            href={`/settings/${item.link}`}
            className={`xs:px-3 flex flex-1 flex-col items-center gap-1 px-2 py-3 text-center transition-colors ${
              pathname.startsWith(`/settings/${item.link}`)
                ? "border-accent text-accent border-b-2"
                : "text-muted hover:text-text"
            }`}
          >
            <item.icon size={18} />
            <span className="text-[10px]">{`${item.link[0].toUpperCase() + item.link.slice(1)}`}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
