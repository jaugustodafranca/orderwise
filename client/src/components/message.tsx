import { memo } from "react";
import breaks from "remark-breaks";
import Markdown from "react-markdown";
import { isSameDay, format } from "date-fns";
import { AiChatAvatar } from "./ai-chat-avatar";

enum MessageSender {
  Me = "Me",
  Assistant = "Assistant",
}

interface Message {
  sender: "Me" | "Assistant";
  content: string;
  date: Date;
}
export const Message = memo(({ message }: { message: Message }) => {
  const parseDate = (date: Date) => {
    if (isSameDay(date, new Date())) {
      return format(date, "HH:mm");
    }
    return format(date, "MM/dd/yyyy • HH:mm");
  };
  return (
    <div
      data-me={message.sender === MessageSender.Me}
      className="flex align-middle justify-start gap-3  data-[me=true]:justify-end"
    >
      {message.sender === MessageSender.Assistant ? <AiChatAvatar /> : null}
      <span
        data-me={message.sender === MessageSender.Me}
        className="leading-relaxed text-justify bg-neutral-100 text-slate-500 text-sm p-2 rounded-lg max-w-[70%] data-[me=true]:bg-slate-500 data-[me=true]:text-white"
      >
        <Markdown remarkPlugins={[breaks]}>
          {message.content.replace(/\n/gi, "&nbsp;\n")}
        </Markdown>

        <span className="block text-[10px] text-right mt-1">
          {parseDate(message.date)}
        </span>
      </span>
    </div>
  );
});
