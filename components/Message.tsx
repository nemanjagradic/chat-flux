import { BiCheck, BiCheckDouble } from "react-icons/bi";
import { RoomMember, UserStatus } from "@/app/types";
import { FaStar } from "react-icons/fa";

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
  const msgStatus = () => {
    if (!isOwn) return null;

    if (isGroup) {
      const otherMembers = totalMembers - 1;

      if (readBy.length === otherMembers) {
        return <BiCheckDouble className="text-panel2 text-lg" />;
      } else if (deliveredTo.length === otherMembers) {
        return <BiCheckDouble className="text-lg" />;
      } else {
        return <BiCheck className="text-lg" />;
      }
    }

    if (status === "sent") return <BiCheck className="text-lg" />;
    if (status === "delivered") return <BiCheckDouble className="text-lg" />;
    return <BiCheckDouble className="text-panel2 text-lg" />;
  };

  return (
    <div
      id={`message-${id}`}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} group mb-1`}
    >
      <div className="flex max-w-[65%] items-center gap-1">
        <button
          onClick={onStarClick}
          className={`shrink-0 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100 ${
            isOwn ? "order-first" : "order-last"
          }`}
        >
          <FaStar
            className={`text-sm ${isStarred ? "text-yellow-400" : "text-muted"}`}
          />
        </button>
        <div
          onClick={() => isOwn && onInfoClick?.()}
          className={`flex-1 cursor-pointer rounded-2xl px-4 py-2.5 ${
            isOwn
              ? "bg-accent rounded-tr-sm"
              : "bg-panel2 border-accent/10 rounded-tl-sm border"
          }`}
        >
          <p className={`text-sm ${isOwn ? "text-white" : "text-text"}`}>
            {text}
          </p>
          <div
            className={`mt-1 flex items-center justify-end text-right text-[10px] ${isOwn ? "text-white/60" : "text-muted"}`}
          >
            {time} &nbsp;{msgStatus()}
          </div>
        </div>
      </div>
    </div>
  );
}
