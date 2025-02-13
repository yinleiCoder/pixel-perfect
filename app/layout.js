import { Geist, Geist_Mono } from "next/font/google";
import { ConvexClientProvider } from "./components/ConvexClientProvider";
import Header from "./components/Header";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pixel Perfect",
  description: "在这里，你可以获取作者开发的所有实用的软件，包括游戏外挂程序，是的，免费！",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          <Header />
          {children}
        </ConvexClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
