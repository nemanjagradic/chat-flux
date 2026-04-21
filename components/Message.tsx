import { BiCheck, BiCheckDouble } from "react-icons/bi";
import { RoomMember, UserStatus } from "@/app/types";
import { FaStar } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import { FaCircleInfo } from "react-icons/fa6";

type MessageProps = {
  id: string;
  text: string;
  time: string;
  isOwn: boolean;
  isGroup?: boolean;
  members?: RoomMember[];
  onInfoClick?: () => void;
  onStarClick?: () => void;
  isStarred: boolean;
  deliveredAt?: string | Date;
  readAt?: string | Date;
  deliveredTo?: UserStatus[];
  readBy?: UserStatus[];
  totalMembers?: number;
  status?: string;
};

export default function Message({
  id,
  text,
  time,
  isOwn,
  isGroup = false,
  deliveredTo = [],
  readBy = [],
  totalMembers = 0,
  status,
  onInfoClick,
  onStarClick,
  isStarred,
}: MessageProps) {
  const [showActions, setShowActions] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        messageRef.current &&
        !messageRef.current.contains(e.target as Node)
      ) {
        setShowActions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setShowActions(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const msgStatus = () => {
    if (!isOwn) return null;
    if (isGroup) {
      const otherMembers = totalMembers - 1;
      if (readBy.length === otherMembers)
        return <BiCheckDouble className="text-panel2 text-lg" />;
      if (deliveredTo.length === otherMembers)
        return <BiCheckDouble className="text-lg" />;
      return <BiCheck className="text-lg" />;
    }
    if (status === "sent") return <BiCheck className="text-lg" />;
    if (status === "delivered") return <BiCheckDouble className="text-lg" />;
    return <BiCheckDouble className="text-panel2 text-lg" />;
  };

  return (
    <div
      ref={messageRef}
      id={`message-${id}`}
      className={`flex w-full ${isOwn ? "justify-end" : "justify-start"} group relative mb-1`}
    >
      <div className={`flex max-w-[65%] items-center gap-1`}>
        <button
          onClick={onStarClick}
          className={`hidden shrink-0 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100 sm:block ${
            isOwn ? "order-first" : "order-last"
          } ${isStarred ? "opacity-100!" : ""}`}
        >
          <FaStar
            className={`text-sm ${isStarred ? "text-yellow-400" : "text-muted"}`}
          />
        </button>
        <div
          onClick={() => isOwn && onInfoClick?.()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          className={`min-w-0 cursor-pointer rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 ${
            isOwn
              ? "bg-accent rounded-tr-sm"
              : "bg-panel2 border-accent/10 rounded-tl-sm border"
          }`}
        >
          <p
            className={`text-sm break-all whitespace-pre-wrap ${isOwn ? "text-white" : "text-text"}`}
          >
            {text}
          </p>
          <div
            className={`mt-1 flex items-center justify-end text-right text-[10px] ${isOwn ? "text-white/60" : "text-muted"}`}
          >
            {time} &nbsp;{msgStatus()}
          </div>
        </div>
      </div>
      {showActions && (
        <div
          className={`absolute -top-8 flex items-center gap-2 rounded-xl px-3 py-1.5 shadow-lg sm:hidden ${
            isOwn ? "bg-panel2 right-0" : "bg-panel2 left-0"
          }`}
        >
          <button
            onClick={() => {
              onStarClick?.();
              setShowActions(false);
            }}
            className="flex items-center gap-1.5 text-xs"
          >
            <FaStar
              className={`text-sm ${isStarred ? "text-yellow-400" : "text-muted"}`}
            />
            <span
              className={`font-display font-semibold ${isStarred ? "text-yellow-400" : "text-muted"}`}
            >
              {isStarred ? "Unstar" : "Star"}
            </span>
          </button>
          {isOwn && (
            <button
              onClick={() => {
                onInfoClick?.();
                setShowActions(false);
              }}
              className="font-display text-muted flex items-center gap-1.5 text-xs font-semibold"
            >
              <FaCircleInfo className="text-muted text-sm" />
              Info
            </button>
          )}
        </div>
      )}
    </div>
  );
}
