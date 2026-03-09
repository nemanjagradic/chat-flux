import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../../../lib/session";
import Notifications from "../../../../../components/Notifications";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account");
  return <Notifications />;
}
