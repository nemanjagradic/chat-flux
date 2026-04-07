import { redirect } from "next/navigation";
import Header from "../../../../../components/UI/Header";
import { getCurrentUser } from "../../../../../lib/session";
import AccountForm from "../../../../../components/AccountForm";

export default async function Account() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  return (
    <div className="flex-1">
      <div className="bg-panel border-accent/20 flex flex-col border-b p-8">
        <Header>Account</Header>
        <AccountForm user={user} />
      </div>
    </div>
  );
}
