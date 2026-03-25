import NextAuthSessionProvider from "@/components/SessionProvider"
import { Geist } from "next/font/google"
import ThemeProvider from "@/components/ThemeProvider"
import "./globals.css";

const geist = Geist({ subsets: ["latin"] })

export const metadata = {
  title: "GateDrop",
  description: "Digital product marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <ThemeProvider>
        <NextAuthSessionProvider>
        {children}
        </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
