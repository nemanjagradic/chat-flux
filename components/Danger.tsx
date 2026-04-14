"use client";

import { MdLogout } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import Header from "./UI/Header";
import SettingItem from "./UI/SettingItem";
import { useRouter } from "next/navigation";
import { deleteAccount, logout } from "../lib/session";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

export default function Danger() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  const handleDelete = async () => {
    await deleteAccount();
    router.push("/auth");
  };
  return (
    <div className="flex-1">
      {showLogoutModal && (
        <ConfirmModal
          title="Log Out"
          description="Are you sure you want to sign out of your current session?"
          confirmLabel="Log Out"
          onConfirm={() => handleLogout()}
          onClose={() => setShowLogoutModal(false)}
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
              onAction={() => setShowLogoutModal(true)}
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
