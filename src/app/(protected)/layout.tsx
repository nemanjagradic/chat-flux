"use client";

import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import CreateGroupModal from "../../../components/CreateGroupModal";
import Sidebar from "../../../components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isGroupModalShow = useSelector(
    (state: RootState) => state.ui.isGroupModalShow,
  );

  return (
    <div className="bg-base relative flex h-screen w-full">
      <Sidebar />
      {children}
      {isGroupModalShow && <CreateGroupModal />}
    </div>
  );
}
