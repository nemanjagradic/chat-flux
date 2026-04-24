import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/session";

export default async function NotFound() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/conversations");
  } else {
    redirect("/auth");
  }
}
