export default function Spinner() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div
        className={`border-accent/20 border-t-accent h-10 w-10 animate-spin rounded-full border-4`}
      />
    </div>
  );
}
