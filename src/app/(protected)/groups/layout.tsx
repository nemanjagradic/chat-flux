import { getCurrentUser } from "../../../../lib/session";
import { redirect } from "next/navigation";
import GroupList from "../../../../components/GroupList";
import { getUserRooms } from "../../../../actions/roomsActions";
import Header from "../../../../components/UI/Header";
import SearchConversations from "../../../../components/SearchConversations";
import ConversationsShell from "../../../../components/ConversationsShell";
import CreateGroupButton from "../../../../components/CreateGroupButton";

export default async function GroupsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  const result = await getUserRooms(user._id);
  const initialRooms = result && "rooms" in result ? result.rooms : [];

  return (
    <ConversationsShell
      sidebar={
        <>
          <div className="border-accent/20 border-b p-4">
            <Header>Groups</Header>
            <SearchConversations userId={user._id} onlyGroups />
            <CreateGroupButton width="w-full" margin="mt-3" hidden />
          </div>
          <div className="flex-1 overflow-y-auto">
            <GroupList initialRooms={initialRooms} />
          </div>
        </>
      }
    >
      {children}
    </ConversationsShell>
  );
}
