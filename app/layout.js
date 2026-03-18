import "./globals.css";

export const metadata = {
  title: "GateDrop",
  description: "Digital product marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
