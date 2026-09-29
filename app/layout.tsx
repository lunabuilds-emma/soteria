import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aegis-ai-compliance.emmapan31.chatgpt.site"),
  title: "Soteria · AI Regulatory Compliance",
  description: "A traceable AI regulatory intelligence and compliance workspace.",
  openGraph: {
    title: "Soteria · AI Regulatory Compliance",
    description: "AI regulatory compliance, made traceable.",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "Soteria AI regulatory compliance platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Soteria · AI Regulatory Compliance",
    description: "AI regulatory compliance, made traceable.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
