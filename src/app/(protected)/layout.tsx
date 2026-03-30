import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../lib/session";
import AppLayout from "../../../components/AppLayout";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  return <AppLayout user={user}>{children}</AppLayout>;
}
