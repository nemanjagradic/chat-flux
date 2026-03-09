"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoKeySharp } from "react-icons/io5";
import { FaRegEnvelope } from "react-icons/fa";
import Input from "../../../../components/UI/Input";
import Button from "../../../../components/UI/Button";
import Link from "next/link";
import { forgotPassword } from "../../../../actions/userActions";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);

    const email = formData.get("email")?.toString() ?? "";

    const result = await forgotPassword(email);

    if (!result) {
      setIsPending(false);
      toast.error("Something went wrong. Please try again.");
      return;
    }

    if (result && "error" in result) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    toast.success(result.message);
    setTimeout(() => {
      router.push("/auth");
    }, 2500);
    setIsPending(false);
  }

  return (
    <div className="bg-base font-display relative h-screen">
      <div className="bg-panel absolute top-1/2 left-1/2 max-h-11/12 min-h-4/5 w-1/3 -translate-x-1/2 -translate-y-1/2 px-12 py-24">
        <h1 className="text-text mb-1 text-3xl font-extrabold">
          Chat<span className="text-accent">Flow</span>
        </h1>
        <h3 className="text-muted mb-6 text-sm">Connect without limits</h3>

        <div className="bg-panel2 border-accent/30 mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border">
          <IoKeySharp className="text-text text-4xl" />
        </div>

        <h1 className="text-text font-display mb-2 text-2xl font-extrabold">
          Forgot your password?
        </h1>

        <p className="text-muted mb-6 text-sm">
          No worries. Enter the email linked to your account and we&apos;ll send
          you a reset link.
        </p>

        <form action={handleSubmit}>
          <Input
            type="text"
            name="email"
            icon={FaRegEnvelope}
            placeholder="Email"
          />

          <p className="text-muted border-accent/30 bg-panel2 my-4 rounded-xl border px-4 py-2.5 text-sm">
            The reset link will be valid for{" "}
            <span className="text-accent">10 minutes</span> after it&apos;s
            sent.
          </p>
          {error && (
            <p className="text-danger font-body mb-4 text-xs">{error}</p>
          )}

          <Button type="submit" width="w-full" disabled={isPending}>
            {isPending ? "Sending..." : "Send Reset Link →"}
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
