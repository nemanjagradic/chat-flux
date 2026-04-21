"use client";

import { useDispatch } from "react-redux";
import { uiActions } from "../store/uiSlice";
import Button from "./UI/Button";

export default function CreateGroupButton({
  width,
  margin,
  hidden,
}: {
  width?: string;
  margin?: string;
  hidden: boolean;
}) {
  const dispatch = useDispatch();
  const showGroupModal = () => {
    dispatch(uiActions.showGroupModal());
  };
  return (
    <Button
      width={width}
      margin={margin}
      hidden={hidden}
      type="button"
      onClick={() => showGroupModal()}
    >
      + New Group
    </Button>
  );
}
