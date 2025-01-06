"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "Welcome to the Instagram Engagement Visualizer! How can I help you understand your data?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }]);
      // Here you would typically send the message to a backend or AI service
      // For now, we'll just echo the message back
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { role: "system", content: `You said: ${input}` },
        ]);
      }, 500);
      setInput("");
    }
  };

  return (
    <Card className="h-screen flex flex-col rounded-none">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Chat with AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-4">
        <ScrollArea className="h-full w-full pr-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-neutral-900 text-gray-100 !rounded-xl"
                    : " text-gray-100 !rounded-xl"
                }`}
              >
                {message.role !== "user" && (
                  <Avatar className="inline-block size-6">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                )}

                <div className="ml-3"></div>

                {message.content}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-shrink-0 p-4 sm:px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative w-full"
        >
          <input
            type="text"
            placeholder="Message AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-lg border bg-background px-4 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              fill="currentColor"
              className="h-4 w-4 "
            >
              <path d="M200 32v144a8 8 0 0 1-8 8H67.31l34.35 34.34a8 8 0 0 1-11.32 11.32l-48-48a8 8 0 0 1 0-11.32l48-48a8 8 0 0 1 11.32 11.32L67.31 168H184V32a8 8 0 0 1 16 0Z" />
            </svg>
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
