import SettingsSidebar from "../../../../components/SettingsSidebar";
import Header from "../../../../components/UI/Header";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-base relative flex h-screen w-full">
      <div className="bg-surface border-accent/20 flex w-80 flex-col border-r">
        <div className="border-accent/20 border-b p-4">
          <Header>Settings</Header>
        </div>
        <SettingsSidebar />
      </div>
      {children}
    </div>
  );
}
