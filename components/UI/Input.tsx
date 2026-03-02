import { IconType } from "react-icons";

type InputProps = {
  icon?: IconType;
  type?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  defaultValue?: string;
};

export default function Input({
  icon: Icon,
  type = "text",
  name,
  id,
  placeholder,
  defaultValue,
}: InputProps) {
  return (
    <div className="border-panel2 group bg-panel2 focus-within:border-accent flex items-center rounded-xl border px-4 py-2.5 transition-colors">
      {Icon && (
        <Icon className="group-focus-within:text-text mr-2 shrink-0 text-xl text-gray-600" />
      )}
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="font-body placeholder:text-muted focus:placeholder:text-text text-text w-full border-none bg-transparent text-sm outline-none"
      />
    </div>
  );
}
