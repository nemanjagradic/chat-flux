import { sessions } from "@/app/(app)/settings/sessions/page";

import { BsGlobe } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";

export default function SessionItem({
  session,
  onRevoke,
}: {
  session: (typeof sessions)[0];
  onRevoke: (id: string) => void;
}) {
  const Icon = session.icon;

  return (
    <div className="flex items-center gap-4 py-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          session.current ? "bg-accent/20" : "bg-panel2"
        }`}
      >
        <Icon
          className={`text-xl ${session.current ? "text-accent" : "text-muted"}`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-display text-text text-sm font-semibold">
            {session.device}
          </p>
          {session.current && (
            <span className="font-display bg-online/10 text-online rounded-md px-2 py-0.5 text-xs font-bold">
              Current
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-3">
          <span className="font-body text-muted flex items-center gap-1 text-xs">
            <BsGlobe className="shrink-0" />
            {session.browser}
          </span>
          <span className="text-muted text-xs">·</span>
          <span className="font-body text-muted flex items-center gap-1 text-xs">
            <HiOutlineLocationMarker className="shrink-0" />
            {session.location}
          </span>
          <span className="text-muted text-xs">·</span>
          <span className="font-body text-muted text-xs">
            {session.lastSeen}
          </span>
        </div>
      </div>

      {!session.current && (
        <button
          type="button"
          onClick={() => onRevoke(session.id)}
          className="font-display text-danger shrink-0 cursor-pointer text-xs font-bold transition-opacity hover:opacity-70"
        >
          Revoke
        </button>
      )}
    </div>
  );
}
