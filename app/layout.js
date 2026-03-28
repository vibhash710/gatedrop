import NextAuthSessionProvider from "@/components/SessionProvider"
import { Geist } from "next/font/google"
import ThemeProvider from "@/components/ThemeProvider"
import { TooltipProvider } from "@/components/ui/tooltip"
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
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
