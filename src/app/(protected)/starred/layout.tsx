import { IoMdSearch } from "react-icons/io";
import ConversationsMenu from "../../../../components/ConversationsMenu";
import Input from "../../../../components/UI/Input";
import Header from "../../../../components/UI/Header";
import RoomList from "../../../../components/RoomList";
import { getCurrentUser } from "../../../../lib/session";
import { redirect } from "next/navigation";
import { getUserRooms } from "../../../../actions/roomsActions";

export default async function StarredPageLayout({
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
      <div className="bg-surface border-accent/20 hidden flex-col gap-2 border-r md:flex md:w-64 lg:flex lg:w-80">
        <div className="border-accent/20 border-b p-4">
          <Header>Messages</Header>
          <Input
            type="text"
            name="search"
            placeholder="Search conversations..."
            icon={IoMdSearch}
          />
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
