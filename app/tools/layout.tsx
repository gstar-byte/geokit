import React from "react";
import EmbedThisTool from "@/components/EmbedThisTool";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-grow flex flex-col">
      {children}
      <div className="mx-auto max-w-4xl px-4 w-full pb-16">
        <EmbedThisTool />
      </div>
    </div>
  );
}
