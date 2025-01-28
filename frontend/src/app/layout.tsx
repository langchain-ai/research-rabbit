import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@copilotkit/react-ui/styles.css";
import { CopilotKit } from "@copilotkit/react-core";
import ChatSidebar from "./components/chat-sidebar";
import Thinking from "./components/thinking";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deep Research Assistant",
  description: "Deep Research Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CopilotKit
          publicApiKey={process.env.NEXT_PUBLIC_COPILOT_CLOUD_API_KEY}
          showDevConsole={false}
          agent="ollama_deep_researcher"
          threadId={crypto.randomUUID()}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
            {/* Left sidebar for chat */}
            <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-gray-200 h-[calc(33vh)] lg:h-screen flex flex-col">
              <div className="sticky top-0 bg-white z-10 p-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Research Chat</h2>
                <p className="text-sm text-gray-500">
                  Research chat with the assistant
                </p>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ChatSidebar />
              </div>
            </div>

            {/* Middle section for thinking/processing */}
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-gray-200 h-[calc(33vh)] lg:h-screen overflow-y-auto bg-gray-50">
              <div className="sticky top-0 bg-gray-50 z-10 p-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Thinking Process</h2>
                <p className="text-sm text-gray-500">
                  See how the agent is thinking
                </p>
              </div>
              <div className="p-4">
                <Thinking />
              </div>
            </div>

            {/* Right section for final results */}
            <div className="lg:col-span-5 h-[calc(33vh)] lg:h-screen overflow-y-auto bg-gray-50 ">
              <div className="sticky top-0 z-10 p-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Finalize Summary</h2>
                <p className="text-sm text-gray-500">
                  See the final summary of the research
                </p>
              </div>
              <div className="p-4">{children}</div>
            </div>
          </div>
        </CopilotKit>
      </body>
    </html>
  );
}
