import { IoMdSearch } from "react-icons/io";
import ConversationsMenu from "../../../../components/ConversationsMenu";
import Input from "../../../../components/UI/Input";
import Header from "../../../../components/UI/Header";

export default function ConversationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-base relative flex h-screen w-full">
      <div className="bg-surface border-accent/20 flex w-80 flex-col gap-2 border-r">
        <div className="border-accent/20 border-b p-4">
          <Header>Messages</Header>
          <Input
            type="text"
            name="search"
            placeholder="Search conversations..."
            icon={IoMdSearch}
          />
        </div>
        <ConversationsMenu />
      </div>
      {children}
    </div>
  );
}
