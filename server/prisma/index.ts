import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

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
  role: "user" | "assistant";
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

export const generateMenuJson = async () => {
  const [meals, drinks, sides, desserts] = await Promise.all([
    prisma.meals.findMany(),
    prisma.drinks.findMany(),
    prisma.sides.findMany(),
    prisma.desserts.findMany(),
  ]);

  const menu = { meals, drinks, sides, desserts };

  const filePath = path.join(__dirname, "menu.json");

  await fs.writeFile(filePath, JSON.stringify(menu, null, 2));

  return filePath;
};
