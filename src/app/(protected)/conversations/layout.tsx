import ConversationsMenu from "../../../../components/ConversationsMenu";
import Header from "../../../../components/UI/Header";
import RoomList from "../../../../components/RoomList";
import { getCurrentUser } from "../../../../lib/session";
import { redirect } from "next/navigation";
import { getUserRooms } from "../../../../actions/roomsActions";
import SearchConversations from "../../../../components/SearchConversations";
import ConversationsShell from "../../../../components/ConversationsShell";
import Link from "next/link";

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
    <ConversationsShell
      sidebar={
        <>
          <div className="border-accent/20 border-b p-4">
            <Header>Messages</Header>
            <SearchConversations userId={user._id} />
            <Link
              href="/conversations/new"
              className="bg-accent mt-3 flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-bold text-white transition-shadow hover:shadow-[0_5px_15px_rgba(79,142,255,0.35)] md:hidden"
            >
              + New Conversation
            </Link>
          </div>
          <ConversationsMenu />
          <div className="flex-1 overflow-y-auto">
            <RoomList currentUserId={user._id} initialRooms={rooms} />
          </div>
        </>
      }
    >
      {children}
    </ConversationsShell>
  );
}
