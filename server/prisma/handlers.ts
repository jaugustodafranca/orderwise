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

export const createOrder = async (args: {
  userId: string;
  items: {
    itemId: string;
    itemCategory: "MEALS" | "DRINKS" | "SIDES" | "DESSERTS";
  }[];
  totalInCents: number;
}) => {
  const order = await prisma.orders.create({
    data: {
      userId: args.userId,
      totalCents: args.totalInCents,
      status: "IN_PROGRESS",
      items: {
        create: args.items.map((item) => ({
          itemId: item.itemId,
          ItemCategory: item.itemCategory,
        })),
      },
    },
    include: { items: true },
  });

  return order.id;
};

export const getOrdersByUser = async (userId: string) => {
  const orders = await prisma.orders.findMany({
    where: { userId },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const enrichedOrders = await Promise.all(
    orders.map(async (order) => {
      const enrichedItems = await Promise.all(
        order.items.map(async (item) => {
          let itemDetails;

          if (item.ItemCategory === "MEALS") {
            itemDetails = await prisma.meals.findUnique({
              where: { id: item.itemId },
            });
          } else if (item.ItemCategory === "DRINKS") {
            itemDetails = await prisma.drinks.findUnique({
              where: { id: item.itemId },
            });
          } else if (item.ItemCategory === "SIDES") {
            itemDetails = await prisma.sides.findUnique({
              where: { id: item.itemId },
            });
          } else if (item.ItemCategory === "DESSERTS") {
            itemDetails = await prisma.desserts.findUnique({
              where: { id: item.itemId },
            });
          }

          return { ...item, itemDetails };
        })
      );

      return { ...order, items: enrichedItems };
    })
  );

  return enrichedOrders;
};

export const updateOrderStatus = async (args: {
  orderId: string;
  status: "CANCELLED" | "REFOUND";
}) => {
  const updatedOrder = await prisma.orders.update({
    where: { id: args.orderId },
    data: { status: args.status },
  });

  return updatedOrder;
};
