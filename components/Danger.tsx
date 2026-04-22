"use client";

import { MdLogout } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import Header from "./UI/Header";
import SettingItem from "./UI/SettingItem";
import { useRouter } from "next/navigation";
import { deleteAccount, logout } from "../lib/session";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { uiActions } from "../store/uiSlice";

export default function Danger() {
  const router = useRouter();
  const isShowLogoutModal = useSelector(
    (state: RootState) => state.ui.isLogoutModalShow,
  );
  const dispatch = useDispatch();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = async () => {
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
    dispatch(uiActions.closeLogoutModal());
    router.push("/auth");
  };

  const handleDelete = async () => {
    const result = await deleteAccount();
    if (!result) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success(result.message);
    dispatch(uiActions.closeLogoutModal());
    router.push("/auth");
  };

  return (
    <div className="flex-1">
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
      {showDeleteModal && (
        <ConfirmModal
          title="Delete Account"
          description="This will permanently delete your account and all your data. This action cannot be undone."
          confirmLabel="Delete Account"
          onConfirm={() => handleDelete()}
          onClose={() => setShowDeleteModal(false)}
          dangerous={true}
        />
      )}
      <div className="bg-panel border-accent/20 flex flex-col border-b p-8">
        <Header>Danger Zone</Header>
        <p className="text-muted mt-4 mb-3 text-sm">
          These actions are permanent and cannot be undone.
        </p>

        <div className="border-accent/10 mb-6 overflow-hidden rounded-2xl border">
          <div className="bg-panel border-accent/10 divide-accent/10 border-b">
            <SettingItem
              label="Log Out"
              description="Sign out of your current session"
              icon={MdLogout}
              iconBg="bg-danger/20"
              actionLabel="Log Out"
              actionStyle="text-danger"
              onAction={() => dispatch(uiActions.showLogoutModal())}
            />
          </div>
          <div className="bg-panel border-accent/10 divide-accent/10 divide-y border-b">
            <SettingItem
              label="Delete"
              description="Permanently delete account and all data"
              icon={BsTrash}
              iconBg="bg-danger/20"
              actionLabel="Delete"
              actionStyle="text-danger"
              onAction={() => setShowDeleteModal(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
