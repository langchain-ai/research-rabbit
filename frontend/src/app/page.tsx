"use client";
import { useCopilotChat } from "@copilotkit/react-core";
import Link from "next/link";
import { Brain } from "lucide-react";

interface FinalSummaryContent {
  content: string;
}

export default function Page() {
  const { visibleMessages } = useCopilotChat();
  const finalSummary = visibleMessages.find(
    (message) =>
      message.type === "TextMessage" &&
      // @ts-ignore
      message.role === "assistant" &&
      // @ts-ignore
      message.content.includes("Finalize Summary") &&
      // @ts-ignore
      !message.content.includes("Finalizing research summary")
  );

  const renderSummaryContent = (content: string) => {
    // Remove the "## Summary" prefix if it exists
    const cleanContent = content.replace(/^## Summary\s*/, "");
    const [summary, sourcesSection] = cleanContent.split("### Sources:");
    const sections =
      summary
        .match(/\*\*(.*?):\*\*/g)
        ?.map((section) => section.replace(/\*\*/g, "").replace(":", "")) || [];

    const getSectionContent = (section: string): string => {
      const regex = new RegExp(
        `\\*\\*${section}:\\*\\* (.*?)(?=\\*\\*|###|$)`,
        "s"
      );
      const match = summary.match(regex);
      return match ? match[1].trim() : "";
    };

    // Parse sources and extract URLs
    const sources = sourcesSection
      .split("*")
      .filter((source) => source.trim())
      .map((source) => {
        const urlMatch = source.match(/(https?:\/\/[^\s]+)/);
        return {
          text: source.replace(/(https?:\/\/[^\s]+)/, "").trim(),
          url: urlMatch ? urlMatch[1] : null,
        };
      });

    return (
      <>
        <div className="space-y-8 py-2">
          <div>
            <h2 className="text-sm text-gray-500 mb-2 sticky top-0">Summary</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {summary.split("**")[0].trim()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow bg-white"
              >
                <h3 className="font-bold text-xl mb-3 text-gray-800">
                  {section}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {getSectionContent(section)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t">
          <h3 className="font-bold text-xl mb-6 text-gray-800">Sources</h3>
          <ul className="space-y-3">
            {sources.map(({ text, url }, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600">
                <span className="text-blue-500 mt-1.5 flex-shrink-0">•</span>
                <span>
                  {text}{" "}
                  {url && (
                    <Link
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 hover:underline"
                    >
                      {url}
                    </Link>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  if (visibleMessages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Brain className="w-12 h-12 animate-pulse text-blue-500 mb-4" />
        <p className="text-sm">Waiting for research to begin...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-4 overflow-y-auto">
        {finalSummary ? (
          <div className="prose max-w-none">
            <div className="text-gray-800">
              {(() => {
                try {
                  const parsed = JSON.parse(
                    // @ts-ignore
                    finalSummary.content
                  ) as FinalSummaryContent;
                  return renderSummaryContent(parsed.content);
                } catch (e) {
                  return null;
                }
              })()}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Brain className="w-12 h-12 animate-pulse text-blue-500 mb-4" />
            <p className="text-sm">Researching...</p>
          </div>
        )}
      </div>
    </div>
  );
}
