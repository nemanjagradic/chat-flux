import { AuthUser } from "@/app/types";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { socket } from "../lib/socket";
import { deleteGuestData, logout } from "../lib/session";
import { toast } from "sonner";
import { uiActions } from "../store/uiSlice";

export function useLogout(user: AuthUser) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    socket.disconnect();
    if (user.isGuest) {
      const result = await deleteGuestData();
      if (!result || "error" in result) {
        toast.error("error" in result ? result.error : "Something went wrong");
        return;
      }
      router.push("/auth");
      return;
    }

    const result = await logout();
    if (!result || "error" in result) {
      toast.error("error" in result ? result.error : "Something went wrong");
      return;
    }
    toast.success(result.message);
    dispatch(uiActions.closeLogoutModal());
    router.push("/auth");
  };

  return { handleLogout };
}
