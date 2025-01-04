import { BotMessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const AiChatAvatar = () => {
  return (
    <Avatar>
      <AvatarFallback className="bg-rose-600 p-2 h-auto">
        <BotMessageSquare className="text-white" />
      </AvatarFallback>
    </Avatar>
  );
};
