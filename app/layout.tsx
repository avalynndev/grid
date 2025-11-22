import type { Metadata } from "next";
import { Indie_Flower } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const indieFlower = Indie_Flower({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "MusicGrid",
  description:
    "Create beats with a web-based step sequencer using multiple tracks, samples, and real-time playback.",
  keywords: [
    "React",
    "TypeScript",
    "Tone.js",
    "Web Audio",
    "Drum Machine",
    "Step Sequencer",
    "Music Production",
    "Interactive UI",
    "Sample Pads",
    "Beat Maker",
  ],
  authors: [{ name: "avalynndev", url: "https://avalynndev.vercel.app/" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${indieFlower.className} antialiased`}>
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
