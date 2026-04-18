"use client";

import Header from "./UI/Header";
import SessionItem from "./UI/SessionItem";
import { TSessionItem } from "@/app/types";
import { revokeAllSessions, revokeSession } from "../lib/session";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Sessions({ sessions }: { sessions: TSessionItem[] }) {
  const router = useRouter();

  const handleRevoke = async (id: string) => {
    const result = await revokeSession(id);
    if (!result) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success(result.message);
    router.refresh();
  };

  const handleRevokeAll = async () => {
    if (sessions.filter((s) => !s.isCurrent).length === 0) {
      toast.info("There are no other sessions to revoke.");
      return;
    }
    const result = await revokeAllSessions(null);
    if (!result) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success(result.message);
    router.refresh();
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
              key={session._id}
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
