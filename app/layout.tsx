import type { Metadata } from "next";
import { Geist, Geist_Mono, Indie_Flower } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const indieFlower = Indie_Flower({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "DrumGrid",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${indieFlower.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
