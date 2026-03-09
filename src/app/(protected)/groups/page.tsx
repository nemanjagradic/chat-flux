import CreateGroupButton from "../../../../components/CreateGroupButton";
import { IoPeopleOutline } from "react-icons/io5";
import { getCurrentUser } from "../../../../lib/session";
import { redirect } from "next/navigation";

export default async function Groups() {
  const user = await getCurrentUser();
  if (!user) redirect("/account");
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <div className="bg-panel2 border-accent/30 flex h-24 w-24 items-center justify-center rounded-3xl border">
        <IoPeopleOutline className="text-text mask-radial-from-neutral-100 text-5xl" />
      </div>
      <p className="font-display text-text text-2xl font-extrabold">
        Pick up where <br></br>you left off
      </p>
      <p className="text-muted text-sm leading-6">
        Select a group or create a <br></br> brand new one.
      </p>
      <CreateGroupButton />
    </div>
  );
}
