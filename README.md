# Orderwise

Orderwise is a prototype of a chat application designed for fast-food businesses, integrated with OpenAI Assistant to provide smarter and more efficient customer service.

## Technologies and Packages Used

### Client

- **React.js**: JavaScript library for building user interfaces.
- **TypeScript**: A superset of JavaScript that adds static typing and enhanced tooling.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **date-fns**: A modern JavaScript date utility library for date manipulation and formatting.
- **lucide-react**: A library of simple and customizable SVG-based icons.
- **shadcn**: A set of pre-styled components designed for faster UI development.
- **react-use-websocket**: A React hook for managing WebSocket connections efficiently.
- **react-markdown**: A React component to render Markdown text as HTML.

### Server

- **Node.js**: Runtime environment for executing JavaScript code on the server.
- **OpenAI**: Integration with OpenAI Assistant for intelligent conversational capabilities.
- **Fastify**: A high-performance web framework for building APIs and applications.
- **Prisma**: An ORM (Object-Relational Mapping) tool for database management and queries.
- **Zod**: A TypeScript-first schema validation library for input parsing and validation.
- **Swagger**: A tool for API documentation and testing, enabling easy visualization and interaction with the server's endpoints.

## Project Structure

- **client/**: Contains the front-end application code built with React and TypeScript.
- **server/**: Contains the back-end server code built with Node.js, Fastify, and Prisma.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/jaugustodafranca/orderwise.git
```

2. Install server dependencies:

```bash
cd orderwise/server
yarn install
```

3. Install client dependencies:

```bash
cd ../client
yarn install
```

### Usage

1. For both (client and server) you can use the command

```bash
yarn dev
```

Server will start and run in the port: `3333`
Client will start and run in the port: `3000`

## Features

- **Create User**:
  - Users can create an account by providing their email and name.
- **Fetch User by Email**:
  - The system validates user accounts using their email addresses.
- **Create Order**:
  - Users can place orders with multiple items from various categories (`MEALS`, `DRINKS`, etc.).
  - The system calculates the total price automatically.
- **Fetch Orders**:
  - Users can view all their past orders.
  - Users can view detailed information for a specific order, including all items and their details.
- **Update Order Status**:
  - Orders can be updated with statuses like `CANCELLED` or `REFOUND`.

## References

- **React.js**: [React Documentation](https://reactjs.org/docs/getting-started.html)
- **Fastify**: [Fastify Documentation](https://www.fastify.io/docs/latest/)
- **OpenAI**: [OpenAI API Documentation](https://platform.openai.com/docs/)

## Licença

[MIT](https://choosealicense.com/licenses/mit/)
