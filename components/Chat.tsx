"use client";

import { useState } from "react";
import chatImg from "../public/images/chat.png";
import Image from "next/image";
import { IoMdSearch } from "react-icons/io";

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newConversation, setNewConversation] = useState(false);

  let chatContent;

  if (selectedChat && !newConversation) {
    chatContent = (
      <>
        {/* Header */}
        <div className="bg-panel2 flex items-center border-b border-white/5 px-5 py-3">
          {/* avatar, name, actions */}
        </div>

        {/* Messages */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
          {/* message bubbles */}
        </div>

        {/* Input bar */}
        <div className="bg-panel2 flex items-center gap-3 border-t border-white/5 px-5 py-3">
          {/* input, send button */}
        </div>
      </>
    );
  }

  if (!selectedChat && !newConversation) {
    chatContent = (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <div className="bg-panel2 border-accent/30 flex h-24 w-24 items-center justify-center rounded-3xl border">
          <Image src={chatImg} alt="chat" width={100} height={100} priority />
        </div>
        <p className="font-display text-text text-2xl font-extrabold">
          Pick up where <br></br>you left off
        </p>
        <p className="text-muted text-sm leading-6">
          Select a conversation or start a <br></br> brand new one.
        </p>
        <button
          type="button"
          onClick={() => setNewConversation(true)}
          className="bg-accent cursor-pointer rounded-xl px-8 py-2.5 text-sm font-bold text-white transition-shadow hover:shadow-[0_5px_15px_rgba(79,142,255,0.35)]"
        >
          + New Conversation
        </button>
      </div>
    );
  }

  if (!selectedChat && newConversation) {
    chatContent = (
      <div className="flex-1">
        <div className="bg-panel2 border-accent/20 flex items-center justify-between border-b p-4">
          <h2 className="font-display text-text mb-2 text-xl font-extrabold">
            New Conversation
          </h2>
          <button type="button" className="text-accent cursor-pointer text-sm">
            Create group chat instead →
          </button>
        </div>
        <div className="bg-panel2 p-5">
          <div className="new-conversation border-panel2 bg-panel focus-within:border-accent flex items-center rounded-xl border px-4 py-2.5 transition-colors">
            <IoMdSearch className="mr-2 text-xl text-gray-600" />
            <input
              type="text"
              name="search"
              placeholder="Search by name or @username"
              className="font-body placeholder:text-text text-text w-full border-none bg-transparent text-sm outline-none"
            />
          </div>
        </div>
      </div>
    );
  }

  return chatContent;
}
