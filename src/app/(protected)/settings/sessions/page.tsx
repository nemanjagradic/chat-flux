import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../../../lib/session";
import Sessions from "../../../../../components/Sessions";

export default async function SessionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");
  return <Sessions />;
}
