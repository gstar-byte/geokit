import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "llms.txt Validator — Check Your llms.txt for Spec Compliance | GEOKit",
  description:
    "Paste your llms.txt content and validate it against the spec. Checks H1 title, markdown format, link structure, file size, and best practices. Free online llms.txt validator with detailed error reporting.",
  keywords: [
    "llms.txt validator",
    "validate llms.txt",
    "llms.txt checker",
    "llms.txt spec",
    "llms.txt syntax check",
  ],
  openGraph: {
    title: "llms.txt Validator — Check Your llms.txt for Spec Compliance | GEOKit",
    description:
      "Validate your llms.txt file against the spec. Free online tool with detailed errors.",
    type: "website",
  },
  alternates: {
    canonical: "/tools/llms-txt-validator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
