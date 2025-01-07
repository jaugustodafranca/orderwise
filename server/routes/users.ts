import z from "zod";
import { FastifyTypeInstance } from "../types";
import { prisma } from "../prisma";

export async function users(app: FastifyTypeInstance) {
  app.post(
    "/createUser",
    {
      schema: {
        description: "Create new user",
        tags: ["Users"],
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
        response: {
          201: z.string().describe("User has been created"),
        },
      },
    },
    async (request, reply) => {
      const { name, email } = request.body;
      const user = await prisma.user.create({
        data: {
          name,
          email,
        },
      });

      return reply.status(201).send(user.id);
    }
  );

  app.post(
    "/checkUserByEmail",
    {
      schema: {
        description: "Check if a user exists by email",
        tags: ["Users"],
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          200: z
            .object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
            })
            .nullable()
            .describe("User data"),
        },
      },
    },
    async (request, reply) => {
      const { email } = z
        .object({
          email: z.string().email(),
        })
        .parse(request.body);

      const userExists = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return reply.status(200).send(userExists);
    }
  );
}
