import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CANAL+ | The Perfect Crime — Choose Your Story",
  description: "Interactive thriller — YOU choose who the killer is",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Browser extensions (e.g. “smart converter”) inject attributes on <body> before React hydrates */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
