import { IoMdSearch } from "react-icons/io";
import Header from "../../../../components/UI/Header";

export default function GroupsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-base relative flex h-screen w-full">
      <div className="bg-surface border-accent/20 flex w-80 flex-col gap-2 border-r">
        <div className="border-accent/20 border-b p-4">
          <Header>Groups</Header>
          <div className="border-panel2 bg-panel2 focus-within:border-accent flex items-center rounded-xl border px-4 py-2.5 transition-colors">
            <IoMdSearch className="mr-2 text-xl text-gray-600" />
            <input
              type="text"
              name="search"
              placeholder="Search groups..."
              className="font-body text-text w-full border-none bg-transparent text-sm outline-none focus:ring-0"
            />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
