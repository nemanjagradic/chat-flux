import React from "react";

type ButtonProps = {
  type?: "button" | "submit";
  width?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({
  type = "button",
  width,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-accent cursor-pointer rounded-xl px-8 py-2.5 text-sm font-bold text-white transition-shadow hover:shadow-[0_5px_15px_rgba(79,142,255,0.35)] ${width ?? ""}`}
    >
      {children}
    </button>
  );
}
