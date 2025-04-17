import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { Toaster } from "react-hot-toast";

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
        <SidebarProvider>
          <>
            <AppSidebar />
            <SidebarTrigger />
            {children}
          </>
        </SidebarProvider>
      </body>
    </html>
  );
}
