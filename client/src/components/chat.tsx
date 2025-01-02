import { BotMessageSquare, User } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Chat = () => {
  return (
    <Card className="w-[440px] h-[90vh] grid grid-rows-[min-content_1fr_min-content]">
      <CardHeader>
        <CardTitle>Chat OrderWise:</CardTitle>
        <CardDescription>Chat with the OrderWise assistant</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex align-baseline justify-start gap-3 text-slate-500 text-sm">
          <Avatar>
            <AvatarFallback className="bg-neutral-700 p-2 h-auto">
              <BotMessageSquare className="text-white" />
            </AvatarFallback>
          </Avatar>
          <p className="leading-relaxed text-justify">
            <span className="block font-bold text-slate-700">Assistant:</span>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla
            molestias harum explicabo ut necessitatibus unde? Quos labore
            laudantium repellat maxime ratione corrupti non, hic sed libero
            quidem minima, nam totam!
          </p>
        </div>

        <div className="flex align-baseline justify-start gap-3 text-slate-500 text-sm">
          <Avatar>
            <AvatarFallback className="bg-neutral-700 p-2 h-auto">
              <User className="text-white" />
            </AvatarFallback>
          </Avatar>
          <p className="leading-relaxed text-justify">
            <span className="block font-bold text-slate-700">Me:</span>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla
            molestias harum explicabo ut necessitatibus unde? Quos labore
            laudantium repellat maxime ratione corrupti non, hic sed libero
            quidem minima, nam totam!
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Input placeholder="How can I help you?" />
        <Button type="submit">Send</Button>
      </CardFooter>
    </Card>
  );
};
