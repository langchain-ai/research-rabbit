"use client";
import {
  AssistantMessageProps,
  CopilotChat,
  ResponseButtonProps,
} from "@copilotkit/react-ui";
import { useCoAgent } from "@copilotkit/react-core";
import { Brain } from "lucide-react";

export interface AgentState {
  research_topic: string;
  search_query: string;
  web_research_results: string[];
  sources_gathered: string[];
  research_loop_count: number;
  running_summary: string;
}

const ResponseButton = (props: ResponseButtonProps) => {
  return <></>;
};

const safelyParseJSON = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return json;
  }
};

const AssistantMessage = (props: AssistantMessageProps) => {
  if (props.message) {
    const parsed = safelyParseJSON(props.message);

    // Handle streaming messages with node/content format
    if (typeof parsed === "object" && parsed.node && parsed.content) {
      /**
       * We don't want to show the "Finalize Summary" message in the sidebar
       * because we have a separate "finalize summary" section for that.
       */
      if (
        parsed.node === "Finalize Summary" &&
        parsed.content !== "Finalizing research summary..."
      ) {
        return null;
      }
      return (
        <div className="flex flex-col gap-2 p-3 rounded bg-gray-50/30">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Brain className="w-4 h-4" />
            <span className="font-mono">{parsed.node}</span>
          </div>
          <div className="text-sm font-medium pl-6 text-gray-800">
            {parsed.content}
          </div>
        </div>
      );
    }

    // Handle query/aspect/rationale format
    if (typeof parsed === "object" && parsed.query) {
      return (
        <div className="flex flex-col gap-2 p-3 rounded bg-blue-50">
          <div className="font-medium">Search Query: {parsed.query}</div>
          {parsed.aspect && (
            <div className="text-sm text-gray-600">Focus: {parsed.aspect}</div>
          )}
          {parsed.rationale && (
            <div className="text-sm text-gray-600">{parsed.rationale}</div>
          )}
        </div>
      );
    }

    const isThinking = typeof parsed === "string" && parsed.includes("<think>");

    if (isThinking) {
      return (
        <div className="flex flex-col gap-2 p-3 rounded bg-yellow-50/50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Brain className="w-4 h-4" />
            <span className="font-mono">Chain of Thought</span>
          </div>
          <div className="text-sm font-medium pl-6 text-gray-800">
            {parsed.replace(/<think>|<\/think>/g, "")}
          </div>
        </div>
      );
    }

    // Handle plain text/think format
    return (
      <div className="text-sm">
        {typeof parsed === "string" ? (
          <div className="text-gray-800">{parsed}</div>
        ) : parsed.knowledge_gap ? null : (
          <div className="text-gray-800">{JSON.stringify(parsed)}</div>
        )}
      </div>
    );
  }
  return null;
};

export default function ChatSidebar() {
  const { state, setState, start } = useCoAgent<AgentState>({
    name: "ollama_deep_researcher",
    initialState: {
      research_topic: null,
      search_query: null,
      web_research_results: [],
      sources_gathered: [],
      research_loop_count: 0,
      running_summary: null,
    },
  });
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="h-full flex flex-col justify-end">
          <CopilotChat
            className="col-span-1"
            ResponseButton={ResponseButton}
            onSubmitMessage={async (message) => {
              setState({
                ...state,
                research_topic: message,
              });
              await start();
            }}
            AssistantMessage={AssistantMessage}
          />
        </div>
      </div>
    </div>
  );
}
