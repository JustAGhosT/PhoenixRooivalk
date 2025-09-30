import type { Metadata } from "next";
import { ThemeProvider } from "../contexts/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phoenix Rooivalk - Counter-Drone Defense",
  description:
    "Blockchain-powered counter-drone defense. Phoenix Rooivalk marketing site.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
