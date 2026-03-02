"use client";

import { MdComputer, MdPhoneIphone, MdTablet } from "react-icons/md";
import Header from "../../../../../components/UI/Header";
import SessionItem from "../../../../../components/UI/SessionItem";

export const sessions = [
  {
    id: "sess_1",
    device: "MacBook Pro",
    browser: "Chrome 121",
    location: "Belgrade, RS",
    lastSeen: "Active now",
    icon: MdComputer,
    current: true,
  },
  {
    id: "sess_2",
    device: "iPhone 15 Pro",
    browser: "Safari 17",
    location: "Belgrade, RS",
    lastSeen: "2 hours ago",
    icon: MdPhoneIphone,
    current: false,
  },
  {
    id: "sess_3",
    device: "Windows PC",
    browser: "Firefox 122",
    location: "Novi Sad, RS",
    lastSeen: "3 days ago",
    icon: MdComputer,
    current: false,
  },
  {
    id: "sess_4",
    device: "iPad Air",
    browser: "Safari 17",
    location: "Belgrade, RS",
    lastSeen: "Last week",
    icon: MdTablet,
    current: false,
  },
];

export default function Sessions() {
  const handleRevoke = (id: string) => {
    console.log("Revoke session:", id);
  };

  const handleRevokeAll = () => {
    console.log("Revoke all sessions");
  };

  return (
    <div className="flex-1">
      <div className="bg-panel border-accent/20 flex flex-col border-b p-8">
        <Header>Active Sessions</Header>
        <p className="font-body text-muted mt-4 mb-3 text-sm">
          All devices currently logged into your account.
        </p>
        <div className="border-accent/10 mb-4 overflow-hidden rounded-2xl border">
          {sessions.map((session, index) => (
            <div
              key={session.id}
              className={`bg-panel px-4 ${
                index !== sessions.length - 1 ? "border-accent/10 border-b" : ""
              }`}
            >
              <SessionItem session={session} onRevoke={handleRevoke} />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleRevokeAll}
          className="border-danger/20 bg-danger/5 text-danger font-display hover:bg-danger/10 cursor-pointer rounded-xl border px-8 py-2.5 text-sm font-bold transition-colors"
        >
          Revoke All Other Sessions
        </button>
      </div>
    </div>
  );
}
