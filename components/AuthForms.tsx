"use client";

import { FaRegEnvelope, FaUser, FaAt } from "react-icons/fa";
import { IoLockClosed } from "react-icons/io5";

import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import Input from "./UI/Input";
import Button from "./UI/Button";
import {
  signupUser,
  signinUser,
  createGuestUser,
} from "../actions/userActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { socket } from "../lib/socket";

export default function AuthForms() {
  const router = useRouter();

  const [mode, setMode] = useState("signin");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleGuestLogin = async () => {
    setIsPending(true);
    setError(null);

    const result = await createGuestUser(null);

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

    const res = await fetch("/api/session");
    const { token } = await res.json();
    socket.auth = { sessionToken: token };
    socket.connect();

    toast.success(result.message);
    setTimeout(() => {
      router.push("/conversations");
    }, 2500);
    setIsPending(false);
  };

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    setError(null);

    const name = formData.get("name")?.toString() ?? "";
    const username = formData.get("username")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const passwordConfirm = formData.get("passwordConfirm")?.toString() ?? "";

    let result;

    if (mode === "signup") {
      result = await signupUser({
        name,
        username,
        email,
        password,
        passwordConfirm,
      });
    } else {
      result = await signinUser({ email, password });
    }

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

    const res = await fetch("/api/session");
    const { token } = await res.json();
    socket.auth = { sessionToken: token };
    socket.connect();

    toast.success(result.message);
    setTimeout(() => {
      router.push("/conversations");
    }, 2500);
    setIsPending(false);
  };

  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    setError(null);
  };

  return (
    <>
      <div className="flex rounded-xl bg-[#1d2c4f] p-1">
        <button
          className={`flex-1 rounded-lg py-1 ${
            mode === "signin"
              ? "bg-accent text-text"
              : "text-muted bg-[#1d2c4f]"
          }`}
          type="button"
          onClick={() => handleModeChange("signin")}
        >
          Sign in
        </button>
        <button
          className={`flex-1 rounded-lg py-1 ${
            mode === "signup"
              ? "bg-accent text-text"
              : "text-muted bg-[#1d2c4f]"
          }`}
          type="button"
          onClick={() => handleModeChange("signup")}
        >
          Sign up
        </button>
      </div>

      {mode === "signin" ? (
        <SigninForm
          setMode={setMode}
          handleSubmit={handleSubmit}
          onGuestLogin={handleGuestLogin}
          error={error}
          isPending={isPending}
        />
      ) : (
        <SignupForm
          handleSubmit={handleSubmit}
          error={error}
          isPending={isPending}
        />
      )}
    </>
  );
}

const SigninForm = ({
  setMode,
  handleSubmit,
  onGuestLogin,
  error,
  isPending,
}: {
  setMode: Dispatch<SetStateAction<string>>;
  handleSubmit: (formData: FormData) => void;
  onGuestLogin: () => void;
  error: string | null;
  isPending: boolean;
}) => {
  return (
    <form className="my-4 space-y-3" action={handleSubmit}>
      <Input
        type="text"
        name="email"
        placeholder="Email"
        icon={FaRegEnvelope}
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        icon={IoLockClosed}
      />
      <Link
        className="text-accent block w-full text-right text-sm"
        href="/forgotPassword"
      >
        Forgot Password?
      </Link>
      {error && <p className="text-danger font-body text-xs">{error}</p>}
      <Button type="submit" width="w-full" disabled={isPending}>
        {isPending ? "Loading..." : "Continue →"}
      </Button>
      <p className="text-muted text-center text-sm">
        Don&apos;t have an account?{" "}
        <span
          onClick={() => setMode("signup")}
          className="text-accent cursor-pointer"
        >
          Create one free
        </span>
      </p>
      <div className="flex items-center gap-3">
        <div className="border-accent/20 flex-1 border-t" />
        <span className="text-muted text-xs">or</span>
        <div className="border-accent/20 flex-1 border-t" />
      </div>

      <button
        type="button"
        onClick={onGuestLogin}
        disabled={isPending}
        className="border-accent/20 text-muted hover:bg-panel2 hover:text-text flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>👤</span>
        {isPending ? "Loading..." : "Continue as Guest"}
      </button>
    </form>
  );
};

const SignupForm = ({
  handleSubmit,
  error,
  isPending,
}: {
  handleSubmit: (formData: FormData) => void;
  error: string | null;
  isPending: boolean;
}) => {
  return (
    <form className="my-4 space-y-3" action={handleSubmit}>
      <Input type="text" name="name" placeholder="Full Name" icon={FaUser} />
      <Input type="text" name="username" placeholder="Username" icon={FaAt} />
      <Input
        type="text"
        name="email"
        placeholder="Email"
        icon={FaRegEnvelope}
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        icon={IoLockClosed}
      />
      <Input
        type="password"
        name="passwordConfirm"
        placeholder="Confirm password"
        icon={IoLockClosed}
      />
      {error && (
        <div className="flex flex-col gap-1">
          {error.split(".").map((err, i) => (
            <p key={i} className="text-danger text-sm">
              {err}
            </p>
          ))}
        </div>
      )}
      <Button type="submit" width="w-full" disabled={isPending}>
        {isPending ? "Loading..." : "Create Account →"}
      </Button>
    </form>
  );
};
