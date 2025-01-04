import InstagramCharts from "../components/charts";
import ChatInterface from "../components/chat";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Page() {
  return (
    <div className="flex h-screen overflow-hidden custom-scrollbar">
      <div className="flex-grow overflow-auto p-4">
        <div className="max-w-5xl mx-auto">
          <InstagramCharts />
        </div>
      </div>
      <div className="w-[25%] flex-shrink-0">
        <ChatInterface />
      </div>
    </div>
  );
}
