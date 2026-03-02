"use client";

import { useDispatch } from "react-redux";
import { uiActions } from "../store/uiSlice";

export default function CreateGroupInsteadButton() {
  const dispatch = useDispatch();

  return (
    <button
      type="button"
      onClick={() => dispatch(uiActions.showGroupModal())}
      className="text-accent cursor-pointer text-sm"
    >
      Create group chat instead →
    </button>
  );
}
