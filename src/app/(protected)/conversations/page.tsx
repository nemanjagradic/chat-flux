import Image from "next/image";
import chatImg from "../../../../public/images/chat.png";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../../lib/session";

export default async function Conversations() {
  const user = await getCurrentUser();
  if (!user) redirect("/account");
  return (
    <>
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
        <Link
          href="/conversations/new"
          className="bg-accent cursor-pointer rounded-xl px-8 py-2.5 text-sm font-bold text-white transition-shadow hover:shadow-[0_5px_15px_rgba(79,142,255,0.35)]"
        >
          + New Conversation
        </Link>
      </div>
    </>
  );
}
