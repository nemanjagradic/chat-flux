"use client";

export default function ConfirmModal({
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
  dangerous = false,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  dangerous?: boolean;
}) {
  return (
    <div
      className="bg-surface/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-panel border-accent/20 w-full max-w-sm rounded-2xl border p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-text mb-2 text-lg font-bold">
          {title}
        </h2>
        <p className="text-muted mb-6 text-sm">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="border-accent/20 text-muted font-display flex-1 cursor-pointer rounded-xl border py-2.5 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`font-display flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-semibold text-white ${
              dangerous
                ? "bg-danger hover:bg-danger/80"
                : "bg-accent hover:bg-accent/80"
            } transition-colors`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
