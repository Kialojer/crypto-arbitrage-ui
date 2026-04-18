import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// ۱. ایمپورت کردن پرووایدر کلرک
import { ClerkProvider } from "@clerk/nextjs"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crypto Arbitrage AI",
  description: "Advanced AI Agent for Brazil Crypto Market",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ۲. کل محتوا را داخل ClerkProvider قرار بده
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}