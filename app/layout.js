import NextAuthSessionProvider from "@/components/SessionProvider"
import "./globals.css";

export const metadata = {
  title: "GateDrop",
  description: "Digital product marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextAuthSessionProvider>
        {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
