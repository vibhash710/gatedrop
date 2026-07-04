import NextAuthSessionProvider from "@/components/SessionProvider"
import { Geist } from "next/font/google"
import ThemeProvider from "@/components/ThemeProvider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const geist = Geist({ subsets: ["latin"] })

export const metadata = {
  title: "GateDrop",
  description: "Digital product marketplace",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <ThemeProvider>
          <NextAuthSessionProvider>
            <TooltipProvider>
              {children}
              <Toaster richColors position="bottom-right" duration={3000} />
            </TooltipProvider>
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
