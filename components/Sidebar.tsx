"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  IoChatbubbleOutline,
  IoPeopleOutline,
  IoStarOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { deleteGuestData, logout } from "../lib/session";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { uiActions } from "../store/uiSlice";
import ConfirmModal from "./ConfirmModal";
import { AuthUser } from "@/app/types";
import { toast } from "sonner";

export default function Sidebar({ user }: { user: AuthUser }) {
  const pathname = usePathname();
  const { roomId } = useParams();
  const hasActiveRoom = !!roomId;
  const router = useRouter();
  const isShowLogoutModal = useSelector(
    (state: RootState) => state.ui.isLogoutModalShow,
  );
  const dispatch = useDispatch();

  const handleLogout = async () => {
    if (user.isGuest) {
      const result = await deleteGuestData();
      if (!result) {
        toast.error("Something went wrong. Please try again.");
        return;
      }
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      router.push("/auth");
      return;
    }

    const result = await logout();
    if (!result) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success(result.message);
    router.push("/auth");
  };

  const sidebarItems = [
    { title: "conversations", icon: IoChatbubbleOutline },
    { title: "groups", icon: IoPeopleOutline },
    { title: "starred", icon: IoStarOutline },
    { title: "settings", icon: IoSettingsOutline },
  ];

  return (
    <div
      className={`${hasActiveRoom ? "xs:w-20 hidden w-14 md:flex" : "xs:w-20 flex w-14"} bg-sidebar border-accent/20 flex shrink-0 flex-col items-center gap-y-4 border-r py-4`}
    >
      <Link
        href="/conversations"
        className="text-accent text-3xl font-extrabold"
      >
        C
      </Link>
      {sidebarItems.map((item) => (
        <Link
          key={item.title}
          href={`${item.title.startsWith("settings") ? `/${item.title}/profile` : `/${item.title}`}`}
          className={`xs:h-12 xs:w-12 flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
            pathname.startsWith(`/${item.title}`)
              ? "bg-accent/15 text-accent"
              : "text-muted hover:text-text hover:bg-accent/7"
          }`}
        >
          <item.icon
            className={`h-4.5 w-4.5 sm:h-5 sm:w-5 ${
              pathname.startsWith(`/${item.title}`)
                ? "text-white"
                : "text-muted"
            }`}
          />
        </Link>
      ))}

      <button
        onClick={() => {
          if (user.isGuest) {
            handleLogout();
            return;
          }
          dispatch(uiActions.showLogoutModal());
        }}
        className="xs:h-12 xs:w-12 text-muted hover:text-text hover:bg-accent/7 mt-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors"
      >
        <MdOutlineLogout className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
      </button>
      {isShowLogoutModal && (
        <ConfirmModal
          title="Log Out"
          description="Are you sure you want to sign out of your current session?"
          confirmLabel="Log Out"
          onConfirm={() => handleLogout()}
          onClose={() => dispatch(uiActions.closeLogoutModal())}
          dangerous={false}
        />
      )}
    </div>
  );
}
