import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CANAL+ | Schaduw van de Waarheid",
  description: "Interactief onderzoeksdrama waarin jij de waarheid interpreteert.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Browser extensions (e.g. “smart converter”) inject attributes on <body> before React hydrates */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
