"use client";

import { AuthUser, TStarredMessage } from "@/app/types";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getInitials } from "../lib/formatters";
import { formatStarredMessageTime } from "../lib/formatters";

export default function StarredMessages({
  messages,
  currentUser,
}: {
  messages: TStarredMessage[];
  currentUser: AuthUser;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col">
      <div className="bg-panel2 border-accent/10 flex items-center gap-4 border-b px-6 py-4">
        <div>
          <div className="flex items-center gap-2">
            <FaStar className="text-xl text-yellow-400" />
            <h1 className="font-display text-text text-xl font-bold">
              Starred Messages
            </h1>
          </div>
          <p className="text-muted text-xs">
            Messages you&apos;ve saved for quick access
          </p>
        </div>
      </div>
      <div className="bg-panel flex flex-1 flex-col overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <div className="bg-panel2 border-accent/10 flex h-16 w-16 items-center justify-center rounded-2xl border">
              <FaStar className="text-2xl text-yellow-400/50" />
            </div>
            <p className="font-display text-text text-sm font-semibold">
              No starred messages
            </p>
            <p className="text-muted text-center text-xs">
              Star messages to save them here for quick access.
            </p>
          </div>
        ) : (
          <div className="divide-accent/5 flex flex-col divide-y">
            {messages.map((msg) => {
              const isOwn = msg.senderId._id === currentUser._id;
              const senderName = isOwn ? "You" : msg.senderId.name;
              const senderPhoto = msg.senderId.photo;
              const roomName = msg.roomId?.name;
              const customRoomId = msg.roomId?.roomId ?? msg.customRoomId;

              return (
                <div
                  key={msg._id}
                  onClick={() =>
                    router.push(
                      `/conversations/${customRoomId}?messageId=${msg._id}`,
                    )
                  }
                  className="hover:bg-panel2/50 flex cursor-pointer items-start gap-3 px-5 py-4 transition-colors"
                >
                  {" "}
                  <div className="bg-accent/20 relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                    {senderPhoto ? (
                      <Image
                        src={senderPhoto}
                        alt={senderName}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="font-display text-accent text-[10px] font-bold">
                        {getInitials(senderName)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display text-text text-xs font-semibold">
                          {senderName}
                        </span>
                        {roomName && (
                          <>
                            <span className="text-muted text-xs">in</span>
                            <span className="text-accent text-xs">
                              {roomName}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <FaStar className="text-[10px] text-yellow-400" />
                        <span className="text-muted text-[10px]">
                          {formatStarredMessageTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="text-text/80 line-clamp-2 text-sm leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
