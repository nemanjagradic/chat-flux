"use client";

import { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import Image from "next/image";
import { AuthUser, SearchedUser } from "@/app/types";
import { searchUsers } from "../actions/userActions";
import Header from "./UI/Header";
import Input from "./UI/Input";
import CreateGroupInsteadButton from "./CreateGroupInsteadButton";
import Link from "next/link";
import { getInitials } from "../lib/formatters";

export default function NewConversation({ user }: { user: AuthUser }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchedUser[]>([]);
  const [isPending, setIsPending] = useState(false);

  async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    setIsPending(true);
    const result = await searchUsers({ query, currentUserId: user._id });
    setIsPending(false);
    if (result && "users" in result) setResults(result.users);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="bg-panel border-accent/20 flex flex-wrap items-center justify-between gap-2 border-b p-5 sm:p-8">
        <Header>New Conversation</Header>
        <CreateGroupInsteadButton />
      </div>

      <div className="bg-panel border-accent/20 border-b p-5">
        <Input
          type="text"
          name="search"
          id="search"
          placeholder="Search by name or @username"
          icon={IoMdSearch}
          onChange={handleSearch}
        />
      </div>

      <div className="bg-panel flex-1 overflow-y-auto py-5">
        {isPending && <p className="text-muted px-6 text-sm">Searching...</p>}
        {!isPending && results.length === 0 && (
          <p className="text-muted px-6 text-sm">
            {query
              ? `No results for "${query}"`
              : "Search for someone to start a conversation."}
          </p>
        )}
        {!isPending && results.length > 0 && (
          <>
            <p className="text-muted font-display px-6 pb-3 text-xs font-semibold tracking-widest uppercase">
              All Contacts
            </p>
            {results.map((u) => {
              const roomId = [user._id, u._id].sort().join("_");
              return (
                <div
                  key={u._id}
                  className="hover:bg-panel2 flex cursor-pointer items-center gap-4 px-6 py-3 transition-colors"
                >
                  <div className="bg-surface flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    {u.photo ? (
                      <Image
                        src={u.photo}
                        alt={u.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="font-display text-muted text-xs font-bold">
                        {getInitials(u.name)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-display text-text truncate text-sm font-semibold">
                      {u.name}
                    </p>
                    <p className="text-muted truncate text-xs">@{u.username}</p>
                  </div>

                  <Link
                    href={`/conversations/${roomId}`}
                    className="border-accent/20 text-accent font-display hover:bg-accent shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:text-white"
                  >
                    Message
                  </Link>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
