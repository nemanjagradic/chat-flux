"use client";

import { useSelector } from "react-redux";
import { RootState } from "../store";
import CreateGroupModal from "./CreateGroupModal";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../lib/socket";
import { messagesActions } from "../store/messagesSlice";
import { AuthUser } from "@/app/types";
import { roomsActions } from "../store/roomSlice";
import { UserStatus } from "@/app/types";
import { onlineUsersActions } from "../store/onlineUsersSlice";

export default function AppLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AuthUser;
}) {
  const isGroupModalShow = useSelector(
    (state: RootState) => state.ui.isGroupModalShow,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("getOnlineUsers");
    });
    socket.emit("getOnlineUsers");
    socket.on("onlineUsers", ({ userIds }) => {
      dispatch(onlineUsersActions.setOnlineUsers(userIds));
    });
    socket.on("userOnline", ({ userId }) => {
      dispatch(onlineUsersActions.addOnlineUser(userId));
    });
    socket.on("userOffline", ({ userId, lastSeen }) => {
      dispatch(onlineUsersActions.removeOnlineUser({ userId, lastSeen }));
    });
    socket.on(
      "messagesDelivered",
      ({
        messages,
      }: {
        messages: { messageId: string; roomId: string; deliveredAt: Date }[];
      }) => {
        messages.forEach(({ messageId, roomId, deliveredAt }) => {
          dispatch(
            messagesActions.updateMessageStatus({
              roomId,
              messageId,
              status: "delivered",
              deliveredAt,
            }),
          );
        });
      },
    );

    socket.on(
      "groupMessagesDelivered",
      ({
        messages,
      }: {
        messages: {
          messageId: string;
          roomId: string;
          deliveredTo: UserStatus[];
        }[];
      }) => {
        messages.forEach(({ messageId, roomId, deliveredTo }) => {
          dispatch(
            messagesActions.updateGroupMessageDeliveredTo({
              roomId,
              messageId,
              deliveredTo,
            }),
          );
        });
      },
    );

    socket.on("roomUpdated", ({ roomId, lastMessage, lastMessageAt }) => {
      dispatch(
        roomsActions.updateRoomLastMessage({
          roomId,
          lastMessage,
          lastMessageAt,
        }),
      );
    });

    return () => {
      socket.off("connect");
      socket.off("messagesDelivered");
      socket.off("groupMessagesDelivered");
      socket.off("roomUpdated");
      socket.off("userOnline");
      socket.off("userOffline");
      socket.off("onlineUsers");
    };
  }, [dispatch]);

  return (
    <div className="bg-base relative flex h-screen w-full">
      <Sidebar />
      {children}
      {isGroupModalShow && <CreateGroupModal user={user} />}
    </div>
  );
}
