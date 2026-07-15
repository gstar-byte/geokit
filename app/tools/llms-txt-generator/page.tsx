"use client";

import { useState } from "react";

interface LinkItem {
  title: string;
  url: string;
  note: string;
}

interface Section {
  id: string;
  heading: string;
  links: LinkItem[];
}

function generateLlmsTxt(
  title: string,
  summary: string,
  sections: Section[]
): string {
  let output = `# ${title}\n\n`;
  if (summary) {
    output += `> ${summary}\n\n`;
  }
  for (const section of sections) {
    if (section.heading) {
      output += `## ${section.heading}\n\n`;
    }
    for (const link of section.links) {
      if (link.url) {
        const note = link.note ? `: ${link.note}` : "";
        output += `- [${link.title || link.url}](${link.url})${note}\n`;
      }
    }
    output += "\n";
  }
  return output.trim() + "\n";
}

export default function LlmsTxtGeneratorPage() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [sections, setSections] = useState<Section[]>([
    {
      id: "1",
      heading: "",
      links: [{ title: "", url: "", note: "" }],
    },
  ]);
  const [copied, setCopied] = useState(false);

  const output = generateLlmsTxt(title, summary, sections);

  const addSection = () => {
    setSections([
      ...sections,
      { id: Date.now().toString(), heading: "", links: [{ title: "", url: "", note: "" }] },
    ]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const updateSection = (id: string, heading: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, heading } : s)));
  };

  const addLink = (sectionId: string) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, links: [...s.links, { title: "", url: "", note: "" }] }
          : s
      )
    );
  };

  const removeLink = (sectionId: string, index: number) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, links: s.links.filter((_, i) => i !== index) }
          : s
      )
    );
  };

  const updateLink = (
    sectionId: string,
    index: number,
    field: keyof LinkItem,
    value: string
  ) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              links: s.links.map((l, i) =>
                i === index ? { ...l, [field]: value } : l
              ),
            }
          : s
      )
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "llms.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">
          llms.txt Generator
        </h1>
        <p className="text-gray-400">
          Create an llms.txt file that tells AI models what your site is about
          and which pages matter most. Deploy to your site root as{" "}
          <code className="text-brand-400">/llms.txt</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Site Title (H1) *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Acme — AI-Powered Project Management"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Summary
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A one-sentence description of your site for AI models to understand your content."
              rows={2}
              className="input-field"
            />
          </div>

          {sections.map((section, sIdx) => (
            <div
              key={section.id}
              className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">
                  Section {sIdx + 1}
                </span>
                {sections.length > 1 && (
                  <button
                    onClick={() => removeSection(section.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove section
                  </button>
                )}
              </div>
              <input
                type="text"
                value={section.heading}
                onChange={(e) => updateSection(section.id, e.target.value)}
                placeholder="Section heading (e.g. Docs, API, Blog)"
                className="input-field"
              />
              {section.links.map((link, lIdx) => (
                <div key={lIdx} className="space-y-2 pl-4 border-l border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Link {lIdx + 1}</span>
                    {section.links.length > 1 && (
                      <button
                        onClick={() => removeLink(section.id, lIdx)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) =>
                      updateLink(section.id, lIdx, "title", e.target.value)
                    }
                    placeholder="Link title (e.g. Getting Started)"
                    className="input-field text-sm"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) =>
                      updateLink(section.id, lIdx, "url", e.target.value)
                    }
                    placeholder="URL (e.g. https://acme.com/docs)"
                    className="input-field text-sm"
                  />
                  <input
                    type="text"
                    value={link.note}
                    onChange={(e) =>
                      updateLink(section.id, lIdx, "note", e.target.value)
                    }
                    placeholder="Optional note (e.g. Quick start guide)"
                    className="input-field text-sm"
                  />
                </div>
              ))}
              <button
                onClick={() => addLink(section.id)}
                className="text-sm text-brand-400 hover:text-brand-300"
              >
                + Add link
              </button>
            </div>
          ))}

          <button
            onClick={addSection}
            className="btn-secondary w-full"
          >
            + Add Section
          </button>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">Preview</h3>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="btn-secondary text-sm py-1.5 px-3"
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
              <button
                onClick={download}
                className="btn-primary text-sm py-1.5 px-3"
              >
                Download
              </button>
            </div>
          </div>
          <pre className="code-block min-h-[400px] whitespace-pre-wrap">
            {output || "# Your llms.txt will appear here"}
          </pre>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-sm text-gray-400">
            <p className="mb-2 font-medium text-gray-300">How to deploy:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Download the file as <code className="text-brand-400">llms.txt</code></li>
              <li>Upload to your website root directory</li>
              <li>Make sure it&apos;s accessible at <code className="text-brand-400">yoursite.com/llms.txt</code></li>
              <li>Validate it with our <a href="/tools/llms-txt-validator" className="text-brand-400 hover:underline">llms.txt Validator</a></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
