import type { Metadata } from "next";
import "./globals.css";

export const metadata = {
  title: "CareLink",
  description: "Portal digital del paciente",
  icons: {
    icon: "/carelink-logo.png",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
