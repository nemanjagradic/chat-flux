"use client";

import { useState } from "react";
import { IoMdClose, IoMdSearch } from "react-icons/io";
import { useDispatch } from "react-redux";
import { uiActions } from "../store/uiSlice";
import Input from "./UI/Input";
import Header from "./UI/Header";
import Button from "./UI/Button";

const GROUP_ICONS = ["🎨", "🚀", "⚡", "🔥", "💡", "🎮", "🎵", "💼", "🌍"];

export default function CreateGroupModal() {
  const [selectedIcon, setSelectedIcon] = useState("🎨");
  const dispatch = useDispatch();

  const closeGroupModal = () => {
    dispatch(uiActions.closeGroupModal());
  };

  return (
    <div
      className="bg-surface/60 fixed inset-0 flex items-center justify-center backdrop-blur-sm"
      onClick={() => closeGroupModal()}
    >
      <div
        className="bg-panel border-accent/20 w-1/3 rounded-2xl border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-accent/20 mb-5 flex items-center justify-between border-b px-6 pt-6 pb-3">
          <Header>Create New Group</Header>
          <button
            type="button"
            onClick={() => closeGroupModal()}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-[#1e2e4f]"
          >
            <IoMdClose className="text-text" />
          </button>
        </div>
        <form className="flex flex-col gap-y-3 px-6 pb-6">
          <div>
            <label
              className="font-display text-muted mb-2 block text-sm tracking-widest uppercase"
              htmlFor="groupName"
            >
              Group Name
            </label>
            <Input
              type="text"
              name="groupName"
              id="groupName"
              placeholder="Pick group name"
            />
          </div>

          <div>
            <label
              className="font-display text-muted mb-2 block text-sm tracking-widest uppercase"
              htmlFor="memberSearch"
            >
              Add Members
            </label>
            <Input
              type="text"
              name="memberSearch"
              id="memberSearch"
              placeholder="Search people..."
              icon={IoMdSearch}
            />
          </div>

          <div>
            <label className="font-display text-muted text-sm tracking-widest uppercase">
              Group Icon
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {GROUP_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-xl transition-all ${
                    selectedIcon === icon
                      ? "bg-accent/20 border-accent border"
                      : "bg-panel border-panel2 hover:border-accent/50 border"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" width="w-full">
            Create Group →
          </Button>
        </form>
      </div>
    </div>
  );
}
