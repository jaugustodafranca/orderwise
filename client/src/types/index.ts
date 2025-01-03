export enum MessageSender {
  Me = "Me",
  Assistant = "Assistant",
}

export interface MessageProps {
  sender: "Me" | "Assistant";
  content: string;
  date: Date;
}
