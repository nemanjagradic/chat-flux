import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../../../lib/session";
import Danger from "../../../../../components/Danger";

export default async function DangerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");
  return <Danger />;
}
