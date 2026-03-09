import { getCurrentUser } from "../../../../../lib/session";
import { redirect } from "next/navigation";
import NewConversation from "../../../../../components/NewConversation";

export default async function NewConversationPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");
  return <NewConversation user={user} />;
}
