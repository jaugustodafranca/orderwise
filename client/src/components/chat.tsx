import { useEffect, useState, useRef, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@radix-ui/react-progress";
import { Message } from "./message";
import { Skeleton } from "./ui/skeleton";
import { MessageProps } from "@/types";
import useWebSocket, { ReadyState } from "react-use-websocket";

const ChatComponent = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [input, setInput] = useState("");

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${import.meta.env.VITE_BASE_URL}chat`
  );

  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isConnected = readyState === ReadyState.OPEN;

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Connected",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Disconnect",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "Assistant",
          content: message.assistantMessage,
          date: new Date(),
        },
      ]);
      setIsLoading(false);
    }
  }, [lastMessage]);

  const handleSendMessage = useCallback(() => {
    if (!input.trim() || !isConnected) return;
    setIsLoading(true);
    const userMessage = {
      userMessage: input.trim(),
    };
    sendMessage(JSON.stringify(userMessage));
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "Me", content: input.trim(), date: new Date() },
    ]);

    setInput("");
  }, [input, isConnected, sendMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="w-[440px] h-[90vh] grid grid-rows-[min-content_1fr_min-content] font-extralight">
      <CardHeader>
        <CardTitle>Chat OrderWise:</CardTitle>
        <CardDescription
          data-connected={isConnected}
          className="data-[connected=true]:text-green-500"
        >
          {connectionStatus}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 overflow-y-auto">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full bg-slate-500" />
            <div className="flex flex-col gap-2 flex-1 bg-neutral-100 max-w-[70%] p-2 rounded-lg">
              <Skeleton className="h-4 w-[55%] bg-slate-500" />
              <Skeleton className="h-4 w-[65%] bg-slate-500" />
              <Skeleton className="h-4 w-[75%] bg-slate-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <Progress />
      <CardFooter className="flex gap-2 p-4">
        <Input
          placeholder="Type your message here..."
          value={input}
          className="focus-visible:ring-transparent focus-visible:border-rose-400 h-[40px] placeholder:text-rose-300 border-2 border-rose-500 text-rose-500 font-extralight"
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button
          type="button"
          className="bg-rose-500 text-white hover:bg-rose-600  focus-visible:bg-rose-600 focus-visible:ring-transparent border-none h-[40px]"
          onClick={handleSendMessage}
          disabled={isLoading || !isConnected}
        >
          Send
        </Button>
      </CardFooter>
    </Card>
  );
};

export const Chat = memo(ChatComponent);
