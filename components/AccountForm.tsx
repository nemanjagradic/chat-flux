"use client";

import { useActionState, useEffect } from "react";
import { updateAccount } from "../actions/userActions";
import { toast } from "sonner";
import { AuthUser } from "@/app/types";
import Button from "./UI/Button";
import Input from "./UI/Input";

export default function AccountForm({ user }: { user: AuthUser }) {
  const [state, action, isPending] = useActionState(updateAccount, null);

  const handleSubmit = (formData: FormData) => {
    if (user.isGuest) {
      toast.info("Not available for guest accounts");
      return;
    }

    const email = formData.get("email")?.toString() ?? "";
    const currentPassword = formData.get("currentPassword")?.toString() ?? "";
    const newPassword = formData.get("newPassword")?.toString() ?? "";
    const confirmNewPassword =
      formData.get("confirmNewPassword")?.toString() ?? "";

    const emailChanged = email !== user.email;

    if (
      !emailChanged &&
      !currentPassword &&
      !newPassword &&
      !confirmNewPassword
    ) {
      toast.info("Nothing to update!");
      return;
    }

    action(formData);
  };

  useEffect(() => {
    if (!state) return;
    if ("message" in state) toast.success(state.message);
  }, [state]);

  return (
    <form className="mt-4 space-y-6" action={handleSubmit}>
      <div>
        <label
          className="font-display text-muted mb-2 block text-sm tracking-widest uppercase"
          htmlFor="email"
        >
          Email Address
        </label>
        <Input type="email" name="email" id="email" defaultValue={user.email} />
      </div>

      <div>
        <label
          className="font-display text-muted mb-2 block text-sm tracking-widest uppercase"
          htmlFor="currentPassword"
        >
          Current Password
        </label>
        <Input
          type="password"
          name="currentPassword"
          id="currentPassword"
          placeholder="Enter current password..."
        />
      </div>
      <div>
        <label
          className="font-display text-muted mb-2 block text-sm tracking-widest uppercase"
          htmlFor="newPassword"
        >
          New Password
        </label>
        <Input
          type="password"
          name="newPassword"
          id="newPassword"
          placeholder="Enter new password..."
        />
      </div>

      <div>
        <label
          className="font-display text-muted mb-2 block text-sm tracking-widest uppercase"
          htmlFor="confirmNewPassword"
        >
          Confirm Password
        </label>
        <Input
          type="password"
          name="confirmNewPassword"
          id="confirmNewPassword"
          placeholder="Confirm new password..."
        />
      </div>

      {state && "error" in state && (
        <div className="flex flex-col gap-1">
          {state.error.split(". ").map((err, i) => (
            <p key={i} className="text-danger text-sm">
              {err}
            </p>
          ))}
        </div>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
