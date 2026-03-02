import { IoMdSearch } from "react-icons/io";
import Input from "../../../../../components/UI/Input";
import Header from "../../../../../components/UI/Header";
import CreateGroupInsteadButton from "../../../../../components/CreateGroupInsteadButton";

export default function NewConversation() {
  return (
    <>
      <div className="flex-1">
        <div className="bg-panel border-accent/20 flex items-center justify-between border-b p-8">
          <Header>New Conversation</Header>
          <CreateGroupInsteadButton />
        </div>
        <div className="bg-panel p-5">
          <Input
            type="text"
            name="search"
            id="search"
            placeholder="Search by name or @username"
            icon={IoMdSearch}
          />
        </div>
      </div>
    </>
  );
}
