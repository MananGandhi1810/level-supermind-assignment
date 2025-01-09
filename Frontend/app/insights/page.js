"use client";
import InstagramCharts from "../components/charts";
import ChatInterface from "../components/chat";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <div className="flex h-screen overflow-hidden custom-scrollbar">
        <div className="flex-grow overflow-auto p-4">
          <div className="max-w-5xl mx-auto">
            <InstagramCharts />
          </div>
        </div>
        <div className="hidden md:block w-[25%] flex-shrink-0">
          <ChatInterface />
        </div>
      </div>
    </Suspense>
  );
}
