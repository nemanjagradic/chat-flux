"use client";

import { useDispatch } from "react-redux";
import { uiActions } from "../store/uiSlice";
import Button from "./UI/Button";

export default function CreateGroupButton() {
  const dispatch = useDispatch();
  const showGroupModal = () => {
    dispatch(uiActions.showGroupModal());
  };
  return (
    <Button type="button" onClick={() => showGroupModal()}>
      + New Group
    </Button>
  );
}
