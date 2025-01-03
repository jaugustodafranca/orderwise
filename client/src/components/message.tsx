import { BotMessageSquare } from "lucide-react";
import { isSameDay, format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
      {message.sender === MessageSender.Assistant ? (
        <Avatar>
          <AvatarFallback className="bg-rose-600 p-2 h-auto">
            <BotMessageSquare className="text-white" />
          </AvatarFallback>
        </Avatar>
      ) : null}
      <p
        data-me={message.sender === MessageSender.Me}
        className="leading-relaxed text-justify bg-neutral-100 text-slate-500 text-sm p-2 rounded-lg max-w-[70%] data-[me=true]:bg-slate-500 data-[me=true]:text-white"
      >
        {message.content}

        <span className="block text-xs text-right mt-1">
          {parseDate(message.date)}
        </span>
      </p>
    </div>
  );
};
