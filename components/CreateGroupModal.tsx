"use client";

import { ChangeEvent, useState } from "react";
import { IoMdClose, IoMdSearch } from "react-icons/io";
import { useDispatch } from "react-redux";
import { uiActions } from "../store/uiSlice";
import Input from "./UI/Input";
import Header from "./UI/Header";
import Button from "./UI/Button";
import { AuthUser, SearchedUser } from "@/app/types";
import { searchUsers } from "../actions/userActions";
import { socket } from "../lib/socket";
import { roomsActions } from "../store/roomSlice";
import { getInitials } from "../lib/formatters";

const GROUP_ICONS = ["🎨", "🚀", "⚡", "🔥", "💡", "🎮", "🎵", "💼"];

export default function CreateGroupModal({ user }: { user: AuthUser }) {
  const [groupName, setGroupName] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [memberSearchResults, setMemberSearchResults] = useState<
    SearchedUser[]
  >([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<SearchedUser[]>([]);
  const [selectedIcon, setSelectedIcon] = useState("🎨");
  const dispatch = useDispatch();

  const closeGroupModal = () => dispatch(uiActions.closeGroupModal());

  const handleSearchMembers = async (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setMemberSearch(query);
    if (!query.trim()) return setMemberSearchResults([]);
    const result = await searchUsers({ currentUserId: user._id, query });
    if (result && "users" in result) setMemberSearchResults(result.users);
  };

  const addMember = (member: SearchedUser) => {
    if (selectedMembers.find((m) => m._id === member._id)) return;
    setSelectedMembers((prev) => [...prev, member]);
    setMemberSearchResults([]);
    setMemberSearch("");
  };

  const removeMember = (userId: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m._id !== userId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsPending(true);

    socket.off("groupError");
    socket.off("groupCreated");

    socket.once("groupError", ({ errors }: { errors: string[] }) => {
      setErrors(errors);
      setIsPending(false);
    });

    socket.once("groupCreated", (room) => {
      dispatch(roomsActions.addRoom(room));
      setIsPending(false);
      closeGroupModal();
    });

    socket.emit("createGroup", {
      name: groupName,
      icon: selectedIcon,
      members: [...selectedMembers.map((m) => m._id), user._id],
    });
  };

  return (
    <div
      className="bg-surface/60 fixed inset-0 flex items-center justify-center backdrop-blur-sm"
      onClick={closeGroupModal}
    >
      <div
        className="bg-panel border-accent/20 w-full max-w-md rounded-2xl border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-accent/20 flex items-center justify-between border-b px-6 py-4">
          <Header>Create New Group</Header>
          <button
            type="button"
            onClick={closeGroupModal}
            className="bg-panel2 hover:bg-accent/10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl transition-colors"
          >
            <IoMdClose className="text-muted" />
          </button>
        </div>
        <form className="flex flex-col gap-4 px-6 py-5" onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <div className="bg-accent2/10 border-accent2/20 rounded-xl border px-4 py-3">
              {errors.map((error, i) => (
                <p key={i} className="text-accent2 text-xs">
                  {error}
                </p>
              ))}
            </div>
          )}
          <div>
            <label
              className="font-display text-muted mb-2 block text-xs tracking-widest uppercase"
              htmlFor="groupName"
            >
              Group Name
            </label>
            <Input
              type="text"
              name="groupName"
              id="groupName"
              placeholder="Pick a group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div>
            <label
              className="font-display text-muted mb-2 block text-xs tracking-widest uppercase"
              htmlFor="memberSearch"
            >
              Add Members
            </label>
            <div className="relative">
              <Input
                type="text"
                name="memberSearch"
                id="memberSearch"
                placeholder="Search by name or @username"
                value={memberSearch}
                onChange={handleSearchMembers}
                icon={IoMdSearch}
              />
              {memberSearchResults.length > 0 && (
                <div className="bg-panel2 border-accent/20 absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border">
                  {memberSearchResults.map((u) => (
                    <div
                      key={u._id}
                      onClick={() => addMember(u)}
                      className="hover:bg-accent/10 flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors"
                    >
                      <div className="bg-accent/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                        <span className="font-display text-accent text-[10px] font-bold">
                          {getInitials(u.name)}
                        </span>
                      </div>
                      <div>
                        <p className="text-text text-xs font-semibold">
                          {u.name}
                        </p>
                        <p className="text-muted text-xs">@{u.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedMembers.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedMembers.map((m) => (
                  <div
                    key={m._id}
                    className="bg-accent/10 border-accent/20 flex items-center gap-1.5 rounded-full border py-1 pr-2 pl-1"
                  >
                    <div className="bg-accent/20 flex h-5 w-5 items-center justify-center rounded-full">
                      <span className="font-display text-accent text-[8px] font-bold">
                        {getInitials(m.name)}
                      </span>
                    </div>
                    <span className="text-text text-xs">{m.name}</span>
                    <button
                      type="button"
                      onClick={() => removeMember(m._id)}
                      className="ml-0.5 cursor-pointer transition-colors"
                    >
                      <IoMdClose className="text-muted text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="font-display text-muted mb-2 block text-xs tracking-widest uppercase">
              Group Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {GROUP_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-xl transition-all ${
                    selectedIcon === icon
                      ? "bg-accent/20 border-accent border"
                      : "bg-panel2 border-accent/10 hover:border-accent/40 border"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" width="w-full" disabled={isPending}>
            {isPending ? "Creating..." : "Create Group →"}
          </Button>
        </form>
      </div>
    </div>
  );
}
