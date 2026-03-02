export default function Header({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <h2 className="font-display text-text mb-2 text-xl font-extrabold">
      {children}
    </h2>
  );
}
