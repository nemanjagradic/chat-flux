import { TSessionItem } from "@/app/types";

import { BsGlobe } from "react-icons/bs";
import { MdComputer, MdPhoneIphone, MdTablet } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { formatLastSeen } from "../../lib/formatters";

function formatLastUsed(date: string, isCurrent: boolean) {
  if (isCurrent) return "Active now";

  return formatLastSeen(date);
}

export default function SessionItem({
  session,
  onRevoke,
}: {
  session: TSessionItem;
  onRevoke: (id: string) => void;
}) {
  const deviceName =
    session.deviceType === "mobile"
      ? `${session.osName ?? "Mobile"} ${session.deviceModel ?? "Phone"}`
      : session.deviceType === "tablet"
        ? `${session.osName ?? "Tablet"} ${session.deviceModel ?? "Tablet"}`
        : `${session.osName ?? "Desktop"} PC`;

  let Icon = MdComputer;
  if (session.deviceType === "mobile") Icon = MdPhoneIphone;
  else if (session.deviceType === "tablet") Icon = MdTablet;

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-4 py-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          session.isCurrent ? "bg-accent/20" : "bg-panel2"
        }`}
      >
        <Icon
          className={`text-xl ${session.isCurrent ? "text-accent" : "text-muted"}`}
        />
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-display text-text text-sm font-semibold">
              {deviceName}
            </p>
            {session.isCurrent && (
              <span className="font-display bg-online/10 text-online rounded-md px-2 py-0.5 text-xs font-bold">
                Current
              </span>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-body text-muted flex items-center gap-1 text-xs">
              <BsGlobe className="shrink-0" />
              {session.browserName}
            </span>
            <span className="font-body text-muted flex items-center gap-1 text-xs">
              <HiOutlineLocationMarker className="shrink-0" />
              {session.location}
            </span>
            <span className="font-body text-muted text-xs">
              {formatLastUsed(session.lastUsedAt, session.isCurrent)}
            </span>
          </div>
        </div>

        {!session.isCurrent && (
          <button
            type="button"
            onClick={() => onRevoke(session._id)}
            className="font-display text-danger shrink-0 cursor-pointer text-xs font-bold transition-opacity hover:opacity-70"
          >
            Revoke
          </button>
        )}
      </div>
    </div>
  );
}
