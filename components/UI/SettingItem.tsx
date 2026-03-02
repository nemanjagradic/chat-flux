import { IconType } from "react-icons";

type SettingItemProps = {
  label: string;
  description: string;
  icon: IconType;
  iconBg: string;
  borderBottom?: string;
  enabled?: boolean;
  onToggle?: () => void;
  actionLabel?: string;
  actionStyle?: string;
  onAction?: () => void;
};

export default function SettingItem({
  label,
  description,
  icon: Icon,
  iconBg,
  borderBottom,
  enabled,
  onToggle,
  actionLabel,
  actionStyle = "text-accent",
  onAction,
}: SettingItemProps) {
  return (
    <div
      className={`${borderBottom && borderBottom} flex items-center gap-4 p-4`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
      >
        <Icon className="text-lg text-white" />
      </div>
      <div className="flex-1">
        <p className="font-display text-text text-sm font-semibold">{label}</p>
        <p className="font-body text-muted mt-0.5 text-xs">{description}</p>
      </div>

      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className={`flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
            enabled ? "bg-accent" : "bg-panel2"
          }`}
        >
          <span
            className={`h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      )}

      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className={`font-display cursor-pointer text-sm font-bold ${actionStyle}`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
