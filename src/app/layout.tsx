import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JeevRaksha – Animal Health Surveillance & Early Warning System",
  description:
    "AI-powered animal health surveillance connecting farmers, veterinarians, laboratories and government teams across rural India.",
};

import ChatFAB from "@/components/ChatFAB";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable} style={{ colorScheme: "light" }}>
      <body className="min-h-full antialiased">
        {children}
        <ChatFAB />
      </body>
    </html>
  );
}
