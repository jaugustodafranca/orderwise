import z from "zod";
import { FastifyTypeInstance } from "../types";
import { prisma } from "../prisma";

export async function users(app: FastifyTypeInstance) {
  app.get(
    "/users",
    {
      schema: {
        description: "Get users list",
        tags: ["Users"],
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
            })
          ),
        },
      },
    },
    async (_, reply) => {
      const users = await prisma.user.findMany();
      return reply.status(200).send(users);
    }
  );

  app.get(
    "/user/:id",
    {
      schema: {
        description: "Get user by id",
        tags: ["Users"],
        response: {
          200: z
            .object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
            })
            .nullable(),
        },
      },
    },
    async (request, reply) => {
      const userIdParam = z.object({
        id: z.string().uuid(),
      });

      const { id } = userIdParam.parse(request.params);
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      return reply.status(200).send(user);
    }
  );

  app.post(
    "/users",
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
}
