"use client";

import { useState } from "react";
import { IoLockClosed } from "react-icons/io5";
import Input from "./UI/Input";
import Button from "./UI/Button";
import Link from "next/link";
import { resetPassword } from "../actions/userActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ResetPasswordPage({ token }: { token: string }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    setError(null);

    const newPassword = formData.get("newPassword")?.toString() ?? "";
    const passwordConfirm = formData.get("passwordConfirm")?.toString() ?? "";

    const result = await resetPassword({ token, newPassword, passwordConfirm });

    if (!result) {
      setIsPending(false);
      toast.error("Something went wrong. Please try again.");
      return;
    }

    if ("error" in result) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    toast.success("Password reset successfully!");
    setTimeout(() => {
      router.push("/auth");
    }, 2500);
    setIsPending(false);
  };

  return (
    <div className="bg-base font-display relative h-screen">
      <div className="bg-panel absolute top-1/2 left-1/2 max-h-11/12 min-h-4/5 w-1/3 -translate-x-1/2 -translate-y-1/2 px-12 py-24">
        <h1 className="text-text mb-1 text-3xl font-extrabold">
          Chat<span className="text-accent">Flow</span>
        </h1>
        <h3 className="text-muted mb-6 text-sm">Connect without limits</h3>

        <div className="bg-panel2 border-accent/30 mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border">
          <IoLockClosed className="text-text text-3xl" />
        </div>

        <h1 className="text-text font-display mb-2 text-2xl font-extrabold">
          Set new password
        </h1>

        <p className="text-muted mb-6 text-sm">
          Choose a strong password for your account. Must be at least 8
          characters.
        </p>

        <form action={handleSubmit}>
          <div className="mb-4">
            <Input
              type="password"
              name="newPassword"
              icon={IoLockClosed}
              placeholder="New password"
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              name="passwordConfirm"
              icon={IoLockClosed}
              placeholder="Confirm new password"
            />
          </div>

          {error && (
            <p className="text-danger font-body mt-3 mb-2 text-xs">{error}</p>
          )}

          <Button type="submit" width="w-full" disabled={isPending}>
            {isPending ? "Resetting..." : "Reset Password →"}
          </Button>

          <p className="text-muted mt-4 text-center text-sm">
            Remembered it?{" "}
            <Link className="text-accent" href="/auth">
              Back to Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
