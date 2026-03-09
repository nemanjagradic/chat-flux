import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "../../components/Providers";
import { Toaster } from "sonner";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster theme="dark" richColors position="top-right" />
      </body>
    </html>
  );
}
