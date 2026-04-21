import SettingsSidebar from "../../../../components/SettingsSidebar";
import Header from "../../../../components/UI/Header";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-base relative flex h-screen w-full flex-col lg:flex-row">
      <div className="bg-surface border-accent/20 flex-col border-r lg:flex lg:w-80">
        <div className="border-accent/20 hidden border-b p-4 lg:block">
          <Header>Settings</Header>
        </div>
        <SettingsSidebar />
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
