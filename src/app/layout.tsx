import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";

const font = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book List",
  description: "Manage books and book categories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <Toaster position="bottom-right" />
        <Providers>
          <AppSidebar />
          <SidebarTrigger />
          {children}
        </Providers>
      </body>
    </html>
  );
}
