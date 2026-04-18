import { getCurrentUser } from "../../../../lib/session";
import { redirect } from "next/navigation";
import { getStarredMessages } from "../../../../actions/messagesActions";
import StarredMessages from "../../../../components/StarredMessages";

export default async function StarredPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  const result = await getStarredMessages(user._id);
  const messages = result && "messages" in result ? result.messages : [];

  return <StarredMessages messages={messages} currentUser={user} />;
}
