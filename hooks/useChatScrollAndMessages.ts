import { TMessage } from "@/app/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { messagesActions } from "../store/messagesSlice";

const emptyMessages: TMessage[] = [];

export function useChatScrollAndMessages({
  roomId,
  initialMessages,
}: {
  roomId: string;
  initialMessages: TMessage[];
}) {
  const dispatch = useDispatch();
  const messages = useSelector(
    (state: RootState) =>
      state.messages.messagesByRoom[roomId] ?? emptyMessages,
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasScrolledToMessage = useRef(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const messageId = searchParams.get("messageId");

  useEffect(() => {
    dispatch(
      messagesActions.setMessages({ roomId, messages: initialMessages }),
    );
  }, [dispatch, initialMessages, roomId]);

  useEffect(() => {
    const el = document.getElementById(`message-${messageId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("bg-yellow-200/20");
      hasScrolledToMessage.current = true;
      setTimeout(() => {
        el.classList.remove("bg-yellow-200/20");
        router.replace(pathname);
      }, 2000);
    } else if (!hasScrolledToMessage.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageId, messages, pathname, router]);

  return { messages, bottomRef };
}
