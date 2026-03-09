"use client";

import { MdLogout } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import Header from "./UI/Header";
import SettingItem from "./UI/SettingItem";
import { AuthUser } from "../actions/userActions";

export default function Danger({ user }: { user: AuthUser }) {
  return (
    <div className="flex-1">
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
              onAction={() => console.log("logout")}
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
              onAction={() => console.log("logout")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
