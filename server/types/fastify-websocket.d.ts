import "@fastify/websocket";

declare module "fastify" {
  interface RouteOptions {
    wsHandler?: (
      connection: { socket: unknown },
      request: FastifyRequest
    ) => void;
  }
}
