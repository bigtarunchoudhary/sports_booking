import type { Metadata } from "next";
import "./globals.css";
import FloatingSportsIcons from "@/components/ui/FloatingSportsIcons";

export const metadata: Metadata = {
  title: "Sports Booking — Dominate The Game",
  description: "Discover & book premier sports courts, football turfs, swimming pools and arenas in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark h-full antialiased bg-black text-white"
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-red-500 selection:text-white relative font-sans">
        <FloatingSportsIcons />
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
