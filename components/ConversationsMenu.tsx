"use client";

import { useState } from "react";

export default function ConversationsMenu() {
  const [active, setActive] = useState("All");
  const tabs = ["All", "Direct", "Groups"];

  return (
    <ul className="font-body flex gap-4 px-4 py-2">
      {tabs.map((tab) => {
        const isActive = active === tab;
        return (
          <li
            key={tab}
            onClick={() => setActive(tab)}
            className={`border-accent/30 cursor-pointer rounded-full border px-3 py-1 font-medium ${
              isActive
                ? "bg-accent text-text"
                : "text-muted hover:bg-panel2 hover:text-text"
            }`}
          >
            {tab}
          </li>
        );
      })}
    </ul>
  );
}
