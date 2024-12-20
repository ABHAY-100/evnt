import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { AOSProvider } from "@/components/providers/AOSProvider";
import LoadingScreen from "@/components/LoadingScreen";

const manrope = localFont({
  src: "../assets/fonts/Manrope.ttf",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "evnt.",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable}`}>
      <body className={`antialiased`}>
        <LoadingScreen />
        <AOSProvider>{children}</AOSProvider>
      </body>
    </html>
  );
}
