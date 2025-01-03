import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import dotenv from "dotenv";
dotenv.config();
import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";

import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { users, chat } from "./routes";
import websocketPlugin from "@fastify/websocket";

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "OrderWise",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

// Registre o plugin WebSocket ANTES das rotas
app.register(websocketPlugin);

// Agora registre as rotas
app.register(users);
app.register(chat);

const port = process.env.port ? Number(process.env.port) : 3333;
app.listen({ port }).then(() => {
  console.log(`✅ Server is running on: ${port}`);
});
