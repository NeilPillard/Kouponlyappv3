import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const socialImage = new URL("/og.png", siteUrl).toString();

export const metadata: Metadata = {
  title: "Kouponly — Good plans, better prices",
  description: "Kerala student deals, experiences, rewards, learning and paid opportunities — all in one Kouponly app.",
  metadataBase: new URL(siteUrl),
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Kouponly — Good plans, better prices",
    description: "Save, go out and grow with Kerala offers built for student life.",
    siteName: "Kouponly",
    images: [{ url: socialImage, width: 1731, height: 909, alt: "Kouponly student deals and opportunities app" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kouponly — Good plans, better prices",
    description: "Save, go out and grow with Kerala offers built for student life.",
    images: [socialImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
