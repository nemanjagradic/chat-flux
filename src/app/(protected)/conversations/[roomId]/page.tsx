import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../../../lib/session";
import { getUserById } from "../../../../../actions/userActions";
import { getRoomByRoomId } from "../../../../../actions/roomsActions";
import Chat from "../../../../../components/Chat";
import GroupChat from "../../../../../components/GroupChat";
import { getMessagesByRoom } from "../../../../../actions/messagesActions";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/auth");

  const roomResult = await getRoomByRoomId(roomId);
  const room = roomResult && "room" in roomResult ? roomResult.room : null;

  const messagesResult = await getMessagesByRoom(roomId);
  const initialMessages =
    messagesResult && "messages" in messagesResult
      ? messagesResult.messages
      : [];

  if (!room) {
    const recipientUserId = roomId
      .split("_")
      .find((id) => id !== currentUser._id);
    if (!recipientUserId) redirect("/conversations");

    const recipientUser = await getUserById(recipientUserId);
    if (!recipientUser || "error" in recipientUser) redirect("/conversations");

    return (
      <Chat
        currentUser={currentUser}
        recipientUser={recipientUser}
        roomId={roomId}
        initialMessages={initialMessages}
      />
    );
  }

  if (room.type === "group") {
    return (
      <GroupChat
        currentUser={currentUser}
        room={room}
        roomId={roomId}
        initialMessages={initialMessages}
      />
    );
  }

  const recipientUserId = roomId
    .split("_")
    .find((id) => id !== currentUser._id);
  if (!recipientUserId) redirect("/conversations");

  const recipientUser = await getUserById(recipientUserId);
  if (!recipientUser || "error" in recipientUser) redirect("/conversations");

  return (
    <Chat
      currentUser={currentUser}
      recipientUser={recipientUser}
      roomId={roomId}
      initialMessages={initialMessages}
    />
  );
}
