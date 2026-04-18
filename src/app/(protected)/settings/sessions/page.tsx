import { redirect } from "next/navigation";
import { getCurrentUser, getUserSessions } from "../../../../../lib/session";
import Sessions from "../../../../../components/Sessions";

export default async function SessionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  const result = await getUserSessions(user._id);

  if (!result || "error" in result) {
    return (
      <div className="text-muted flex flex-1 items-center justify-center text-xs">
        Failed to load sessions. Please try refreshing.
      </div>
    );
  }
  return <Sessions sessions={result.sessions} />;
}
