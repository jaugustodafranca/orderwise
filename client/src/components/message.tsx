import { isSameDay, format } from "date-fns";
import { AiChatAvatar } from "./ai-chat-avatar";
import Markdown from "react-markdown";
enum MessageSender {
  Me = "Me",
  Assistant = "Assistant",
}

interface Message {
  sender: "Me" | "Assistant";
  content: string;
  date: Date;
}

export const Message = ({ message }: { message: Message }) => {
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
      <p
        data-me={message.sender === MessageSender.Me}
        className="leading-relaxed text-justify bg-neutral-100 text-slate-500 text-sm p-2 rounded-lg max-w-[70%] data-[me=true]:bg-slate-500 data-[me=true]:text-white"
      >
        <Markdown>{message.content}</Markdown>

        <span className="block text-[10px] text-right mt-1">
          {parseDate(message.date)}
        </span>
      </p>
    </div>
  );
};
