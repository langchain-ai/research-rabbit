"use client";
import { Brain } from "lucide-react";
import { useCopilotChat } from "@copilotkit/react-core";
import { useEffect, useState } from "react";

export default function Thinking() {
  const { visibleMessages } = useCopilotChat();
  const [thoughts, setThoughts] = useState<string[]>([]);

  // Extract thinking content from messages
  useEffect(() => {
    visibleMessages.forEach((message) => {
      if (
        message.type === "TextMessage" &&
        // @ts-ignore
        typeof message.content === "string"
      ) {
        // @ts-ignore
        const thinkMatch = message.content.match(/<think>(.*?)<\/think>/s);
        if (thinkMatch) {
          setThoughts((prev) => {
            // Only add if not already present
            if (!prev.includes(thinkMatch[1].trim())) {
              return [...prev, thinkMatch[1].trim()];
            }
            return prev;
          });
        }
      }
    });
  }, [visibleMessages]);

  if (visibleMessages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Brain className="w-12 h-12 animate-pulse text-blue-500 mb-4" />
        <p className="text-sm">Waiting for research to begin...</p>
      </div>
    );
  }

  if (thoughts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Brain className="w-12 h-12 animate-pulse text-blue-500 mb-4" />
        <p className="text-sm">Thinking...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500 mb-2 sticky top-0 bg-gray-50 py-2">
        Thought Process ({thoughts.length} steps)
      </div>
      <div className="space-y-4 overflow-y-auto">
        {thoughts.map((thought, i) => (
          <div
            key={i}
            className="italic text-gray-600 bg-gray-100 p-3 rounded-lg flex items-start gap-3 shadow-sm"
          >
            <div className="flex flex-col items-center gap-1">
              <Brain className="w-4 h-4 animate-pulse text-blue-500" />
              <span className="text-xs text-gray-400">#{i + 1}</span>
            </div>
            <div className="flex-1">{thought}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
