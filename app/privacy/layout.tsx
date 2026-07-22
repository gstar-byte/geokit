import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — GEOKit",
  description:
    "GEOKit's privacy policy: all tools run 100% client-side in your browser. No accounts, no data storage, and analytics tracking stays off until you consent.",
  alternates: {
    canonical: "https://geokit.site/privacy",
  },
  openGraph: {
    title: "Privacy Policy — GEOKit",
    description:
      "GEOKit's privacy policy: all tools run 100% client-side in your browser. No accounts, no data storage, and analytics tracking stays off until you consent.",
    type: "website",
    url: "https://geokit.site/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
