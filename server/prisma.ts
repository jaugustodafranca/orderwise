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
