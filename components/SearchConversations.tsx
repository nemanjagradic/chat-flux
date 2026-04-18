"use client";

import { IoMdSearch } from "react-icons/io";
import Input from "./UI/Input";
import { searchRooms } from "../actions/roomsActions";
import { useDispatch, useSelector } from "react-redux";
import { roomsActions } from "../store/roomSlice";
import { RootState } from "../store";

export default function SearchConversations({
  userId,
  onlyGroups,
}: {
  userId: string;
  onlyGroups?: boolean;
}) {
  const dispatch = useDispatch();
  const searchName = useSelector((state: RootState) => state.rooms.searchName);

  const handleSearchConversations = async (name: string) => {
    dispatch(roomsActions.setSearchName(name));

    const result = await searchRooms({ name, userId, onlyGroups });
    if (result && "rooms" in result) {
      dispatch(roomsActions.setRooms(result.rooms));
    }
  };

  return (
    <Input
      type="text"
      name="search"
      placeholder="Search conversations..."
      icon={IoMdSearch}
      value={searchName}
      onChange={(e) => handleSearchConversations(e.target.value)}
    />
  );
}
