import { TSessionItem } from "@/app/types";

import { BsGlobe } from "react-icons/bs";
import { MdComputer, MdPhoneIphone, MdTablet } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import * as UAParser from "ua-parser-js";
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
  const parser = new UAParser.UAParser(session.userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  const deviceName = device.model ?? `${os.name ?? "Desktop"} PC`;

  let Icon = MdComputer;
  if (device.type === "mobile") Icon = MdPhoneIphone;
  else if (device.type === "tablet") Icon = MdTablet;

  return (
    <div className="flex items-center gap-4 py-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          session.isCurrent ? "bg-accent/20" : "bg-panel2"
        }`}
      >
        <Icon
          className={`text-xl ${session.isCurrent ? "text-accent" : "text-muted"}`}
        />
      </div>

      <div className="min-w-0 flex-1">
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
        <div className="mt-0.5 flex items-center gap-3">
          <span className="font-body text-muted flex items-center gap-1 text-xs">
            <BsGlobe className="shrink-0" />
            {browser.name}
          </span>
          <span className="text-muted text-xs">·</span>
          <span className="font-body text-muted flex items-center gap-1 text-xs">
            <HiOutlineLocationMarker className="shrink-0" />
            {session.location}
          </span>
          <span className="text-muted text-xs">·</span>
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
  );
}
