import type { Metadata } from "next";
import "./globals.css";
import backgroundImage from "@/assets/background.png";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Ring Strike App | Portfolio Mock",
  description: "Versão demonstrativa mockada do Ring Strike App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className="portfolio-fonts font-sans"
        style={{
          backgroundImage: `url(${backgroundImage.src})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          minHeight: "100vh",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
