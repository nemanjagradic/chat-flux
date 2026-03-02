"use client";

import { FaRegEnvelope, FaUser } from "react-icons/fa";
import { FcLock } from "react-icons/fc";

import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import Input from "./UI/Input";
import Button from "./UI/Button";

export default function Forms() {
  const [mode, setMode] = useState("signin");
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
          onClick={() => setMode("signin")}
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
          onClick={() => setMode("signup")}
        >
          Sign up
        </button>
      </div>

      {mode === "signin" ? <SigninForm setMode={setMode} /> : <SignupForm />}
    </>
  );
}

const SigninForm = ({
  setMode,
}: {
  setMode: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <form className="my-4 space-y-3">
      <Input
        type="email"
        name="email"
        placeholder="Email"
        icon={FaRegEnvelope}
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        icon={FcLock}
      />
      <Link className="text-accent float-end text-sm" href="forgot-password">
        Forgot Password?
      </Link>
      <Button type="submit" width="w-full">
        Continue →
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
    </form>
  );
};

const SignupForm = () => {
  return (
    <form className="my-4 space-y-3">
      <Input type="text" name="name" placeholder="Full Name" icon={FaUser} />
      <Input
        type="email"
        name="email"
        placeholder="Email"
        icon={FaRegEnvelope}
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        icon={FcLock}
      />
      <Button type="submit" width="w-full">
        Create Account →
      </Button>
    </form>
  );
};
