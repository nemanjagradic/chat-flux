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
import { playMessageSound } from "../lib/sounds";
import { useRouter } from "next/navigation";

export default function AppLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AuthUser;
}) {
  const router = useRouter();
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

    socket.on("newMessageNotification", ({ message }) => {
      if (message.senderId !== user._id && !user.doNotDisturb) {
        const isGroupMessage = !message.recipientId;
        if (isGroupMessage && !user.groupAlerts) return;

        const isTabVisible = document.visibilityState === "visible";

        if (!isTabVisible) {
          if (
            user.desktopNotifications &&
            Notification.permission === "granted"
          ) {
            const notification = new Notification(
              isGroupMessage
                ? `${message.senderName} in ${message.roomName}`
                : (message.senderName ?? "New message"),
              {
                body: message.content,
                icon: "/favicon.ico",
              },
            );

            notification.onclick = () => {
              window.focus();
              router.push(`/conversations/${message.customRoomId}`);
            };
          }
          if (user.notificationSound) {
            playMessageSound();
          }
        } else {
          if (user.messageSounds) {
            playMessageSound();
          }
        }
      }
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

    socket.on(
      "messageReadByMember",
      ({
        messages,
      }: {
        messages: {
          messageId: string;
          roomId: string;
          userId: string;
          at: string;
        }[];
      }) => {
        messages.forEach(({ messageId, roomId, userId, at }) => {
          dispatch(
            messagesActions.addReadByMember({ roomId, messageId, userId, at }),
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
      socket.off("newMessage");
      socket.off("newMessageNotification");
      socket.off("messagesDelivered");
      socket.off("groupMessagesDelivered");
      socket.off("messageReadByMember");
      socket.off("roomUpdated");
      socket.off("userOnline");
      socket.off("userOffline");
      socket.off("onlineUsers");
    };
  }, [
    dispatch,
    router,
    user._id,
    user.desktopNotifications,
    user.doNotDisturb,
    user.groupAlerts,
    user.messageSounds,
    user.notificationSound,
  ]);

  return (
    <div className="bg-base relative flex h-dvh w-full overflow-hidden">
      <Sidebar user={user} />
      {children}
      {isGroupModalShow && <CreateGroupModal user={user} />}
    </div>
  );
}
