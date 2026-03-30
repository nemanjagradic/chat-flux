"use client";

import { TMessage, RoomMember } from "@/app/types";
import { IoClose } from "react-icons/io5";

export default function MessageInfoModal({
  message,
  members,
  onClose,
}: {
  message: TMessage;
  members?: RoomMember[];
  onClose: () => void;
}) {
  const { recipientId, deliveredAt, readAt, deliveredTo, readBy } = message;
  const isDirect = !!recipientId;

  const getMemberName = (userId: string) => {
    const member = members?.find((m) => m._id === userId);
    return member?.name;
  };

  const formatTime = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();

    const isToday = d.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday = d.toDateString() === yesterday.toDateString();

    if (isToday) {
      return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (isYesterday) {
      return `Yesterday ${d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return d.toLocaleString([], {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-panel w-full max-w-sm rounded-2xl p-4 shadow-xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-text text-sm font-semibold">Message info</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-text transition"
          >
            <IoClose size={18} />
          </button>
        </div>
        <div className="max-h-64 space-y-4 overflow-y-auto text-xs">
          <div>
            <p className="text-muted mb-1 font-semibold">
              Delivered:{" "}
              {isDirect &&
                (deliveredAt ? formatTime(deliveredAt) : "Not delivered")}
            </p>

            {!isDirect &&
              (deliveredTo?.length ? (
                deliveredTo.map((d) => (
                  <div key={d.userId} className="flex justify-between py-1">
                    <span className="text-text">{getMemberName(d.userId)}</span>
                    <span className="text-muted">{formatTime(d.at)}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted text-[11px]">No data</p>
              ))}
          </div>
          <div>
            <p className="text-muted mb-1 font-semibold">
              Read: {isDirect && (readAt ? formatTime(readAt) : "Not read")}
            </p>

            {!isDirect &&
              (readBy?.length ? (
                readBy.map((r) => (
                  <div key={r.userId} className="flex justify-between py-1">
                    <span className="text-text">{getMemberName(r.userId)}</span>
                    <span className="text-muted">{formatTime(r.at)}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted text-[11px]">No data</p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
