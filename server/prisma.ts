import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export const getUserByEmail = async (args: { email: string }) => {
  const user = await prisma.user.findUnique({
    where: args,
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  return user;
};

export const createUser = async (args: { name: string; email: string }) => {
  const user = await prisma.user.create({
    data: args,
  });
  return user;
};

export const createChatMessage = async (args: {
  threadId: string;
  role: string;
  message: string;
}) => {
  const data = await prisma.chatMessage.create({
    data: args,
  });
  return data;
};

export const createThread = async (args: { id: string; userId?: string }) => {
  const thread = await prisma.thread.create({
    data: args,
  });
  return thread;
};

export const updateThread = async (args: { id: string; userId: string }) => {
  const thread = await prisma.thread.update({
    where: { id: args.id },
    data: args,
  });
  return thread;
};
