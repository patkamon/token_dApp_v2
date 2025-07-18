import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import "./globals.css";
import { ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Token Launchpad Beta Version",
  description: "Token Launchpad Beta Version. Creating an SPL Token on the Solana blockchain. This application allows you to easily create a custom token on Solana",
  icons: "https://www.antiersolutions.com/wp-content/uploads/2021/12/solan-min.jpg"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <ToastContainer
          position="bottom-right"
        />
      </body>
    </html>
  );
}
