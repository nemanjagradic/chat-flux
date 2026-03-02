import Forms from "../../../../components/Forms";

export default function Auth() {
  return (
    <div className="bg-base font-display relative h-screen">
      <div className="bg-panel absolute top-1/2 left-1/2 max-h-4/5 min-h-4/5 w-1/3 -translate-x-1/2 -translate-y-1/2 px-12 py-24">
        <h1 className="text-text mb-1 text-3xl font-extrabold">
          Chat<span className="text-accent">Flow</span>
        </h1>
        <h3 className="text-muted mb-6 text-sm">Connect without limits</h3>
        <Forms />
      </div>
    </div>
  );
}
