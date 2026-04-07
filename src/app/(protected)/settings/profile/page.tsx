import { redirect } from "next/navigation";
import Header from "../../../../../components/UI/Header";
import { getCurrentUser } from "../../../../../lib/session";
import ProfileForm from "../../../../../components/ProfileForm";

export default async function Profile() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  return (
    <div className="flex-1">
      <div className="bg-panel border-accent/20 flex flex-col border-b p-8">
        <Header>Profile</Header>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
