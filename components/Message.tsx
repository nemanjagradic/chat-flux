import { BiCheck, BiCheckDouble } from "react-icons/bi";
import { RoomMember, UserStatus } from "@/app/types";

type MessageProps = {
  text: string;
  time: string;
  isOwn: boolean;
  isGroup?: boolean;
  members?: RoomMember[];
  onInfoClick?: () => void;

  deliveredAt?: string | Date;
  readAt?: string | Date;

  deliveredTo?: UserStatus[];
  readBy?: UserStatus[];
  totalMembers?: number;

  status?: string;
};

export default function Message({
  text,
  time,
  isOwn,
  isGroup = false,
  deliveredTo = [],
  readBy = [],
  totalMembers = 0,
  status,
  onInfoClick,
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
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-1`}>
      <div
        onClick={() => isOwn && onInfoClick?.()}
        className={`max-w-[65%] cursor-pointer rounded-2xl px-4 py-2.5 ${
          isOwn
            ? "bg-accent rounded-tr-sm"
            : "bg-panel2 border-accent/10 rounded-tl-sm border"
        }`}
      >
        <p className={`text-sm ${isOwn ? "text-white" : "text-text"}`}>
          {text}
        </p>
        <div
          className={`mt-1 flex items-center justify-end text-right text-[10px] ${
            isOwn ? "text-white/60" : "text-muted"
          }`}
        >
          {time} &nbsp;{msgStatus()}
        </div>
      </div>
    </div>
  );
}
