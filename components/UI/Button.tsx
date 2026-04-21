type ButtonProps = {
  type?: "button" | "submit" | "reset";
  width?: string;
  margin?: string;
  hidden?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({
  type = "button",
  width,
  margin,
  hidden,
  children,
  onClick,
  disabled,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-accent cursor-pointer rounded-xl px-8 py-2.5 text-sm font-bold text-white transition-shadow hover:shadow-[0_5px_15px_rgba(79,142,255,0.35)] disabled:cursor-not-allowed disabled:opacity-50 ${width ?? ""} ${margin ?? ""} ${hidden ? "md:hidden" : ""}`}
    >
      {children}
    </button>
  );
}
