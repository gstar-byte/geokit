import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "llms.txt Validator — Check Spec Compliance | GEOKit",
  description:
    "Validate your llms.txt against the spec. Checks H1 title, markdown format, link structure, file size & best practices. Free.",
  keywords: [
    "llms.txt validator",
    "validate llms.txt",
    "llms.txt checker",
    "llms.txt spec",
    "llms.txt syntax check",
  ],
  openGraph: {
    title: "llms.txt Validator — Check Spec Compliance | GEOKit",
    description:
      "Validate your llms.txt against the spec. Free with detailed errors.",
    type: "website",
  },
  alternates: {
    canonical: "/tools/llms-txt-validator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
