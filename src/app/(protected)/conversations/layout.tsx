import ConversationsMenu from "../../../../components/ConversationsMenu";
import Header from "../../../../components/UI/Header";
import RoomList from "../../../../components/RoomList";
import { getCurrentUser } from "../../../../lib/session";
import { redirect } from "next/navigation";
import { getUserRooms } from "../../../../actions/roomsActions";
import SearchConversations from "../../../../components/SearchConversations";

export default async function ConversationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  const result = await getUserRooms(user._id);
  const rooms = result && "rooms" in result ? result.rooms : [];
  return (
    <div className="bg-base relative flex h-screen w-full">
      <div className="bg-surface border-accent/20 flex w-80 flex-col gap-2 border-r">
        <div className="border-accent/20 border-b p-4">
          <Header>Messages</Header>
          <SearchConversations userId={user._id} />
        </div>
        <ConversationsMenu />
        <div className="flex-1 overflow-y-auto">
          <RoomList currentUserId={user._id} initialRooms={rooms} />
        </div>
      </div>
      {children}
    </div>
  );
}
