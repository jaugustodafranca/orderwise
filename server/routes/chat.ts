import z from "zod";
import { FastifyTypeInstance } from "../types";
import { prisma, getUserByEmail, createUser } from "../prisma";
import { OpenAI } from "openai";
import {
  Run,
  RunSubmitToolOutputsParams,
} from "openai/resources/beta/threads/runs/index.mjs";
import { log } from "../utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  project: process.env.OPENAI_API_PROJECT,
  organization: process.env.OPENAI_API_ORGANIZATION,
});

const assistantId = process.env.OPENAI_API_ASSISTANT_ID!;
const PENDING_RUN_STATUS = ["queued", "in_progress"];
const INITIAL_MESSAGE =
  "Welcome to OrderWise, I'm your personal AI assistant. Before we start, could you please provide me with your email?";

const FUNCTION_NAMES = {
  CHECK_USER_ACCOUNT: "check_user_account",
  CREATE_USER_ACCOUNT: "create_user_account",
};

// This function will handle the "requires_action" status of the run which means an external action
const handleExternalAction = async (run: Run, threadId: string) => {
  if (
    run.required_action &&
    run.required_action.submit_tool_outputs &&
    run.required_action.submit_tool_outputs.tool_calls
  ) {
    let userId = null;
    const toolOutputs = await Promise.all(
      run.required_action.submit_tool_outputs.tool_calls.map(async (tool) => {
        const args = JSON.parse(tool.function.arguments);
        if (tool.function.name === FUNCTION_NAMES.CHECK_USER_ACCOUNT) {
          const user = await getUserByEmail(args);
          userId = user?.id;
          return { output: JSON.stringify(user), tool_call_id: tool.id };
        } else if (tool.function.name === FUNCTION_NAMES.CREATE_USER_ACCOUNT) {
          const user = await createUser(args);
          userId = user.id;
          return {
            output: JSON.stringify({ id: user.id }),
            tool_call_id: tool.id,
          };
        }
      })
    );

    if (toolOutputs.length > 0) {
      run = await openai.beta.threads.runs.submitToolOutputsAndPoll(
        threadId,
        run.id,
        { tool_outputs: toolOutputs as RunSubmitToolOutputsParams.ToolOutput[] }
      );
      console.log("Tool outputs submitted successfully.");
    } else {
      console.log("No tool outputs to submit.");
    }
    return { userId };
  }
};

const createRun = async (threadId: string) => {
  log("Creating new run");
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });
  let status = run.status;
  let userId = null;
  while (PENDING_RUN_STATUS.includes(status)) {
    const newRun = await openai.beta.threads.runs.retrieve(
      run.thread_id,
      run.id
    );
    if (newRun.status === "requires_action") {
      const externalActionResponse = await handleExternalAction(
        newRun,
        threadId
      );
      userId = externalActionResponse?.userId;
    } else {
      status = newRun.status;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const messages = await openai.beta.threads.messages.list(threadId);
  const lastMessage =
    messages.data[0].content[0]?.type === "text"
      ? messages.data[0].content[0].text.value
      : "";

  return { lastMessage, userId };
};

export async function chat(app: FastifyTypeInstance) {
  app.get("/chat", { websocket: true }, async (socket, _) => {
    log("WebSocket connection opened");
    let threadId: string | null = null;
    let userId: string | null | undefined = null;

    if (!threadId) {
      log("Creating new thread");
      const threadResponse = await openai.beta.threads.create({
        messages: [
          {
            role: "assistant",
            content: INITIAL_MESSAGE,
          },
        ],
      });
      threadId = threadResponse.id;
      await createRun(threadId);
      socket.send(JSON.stringify({ assistantMessage: INITIAL_MESSAGE }));
    }

    socket.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());
        const { userMessage } = z
          .object({
            userMessage: z.string(),
          })
          .parse(data);

        await openai.beta.threads.messages.create(threadId, {
          role: "user",
          content: userMessage,
        });

        const runResponse = await createRun(threadId);
        userId = runResponse.userId;
        socket.send(
          JSON.stringify({ assistantMessage: runResponse.lastMessage })
        );
      } catch (error) {
        console.error("Error processing chat:", error);
        socket.send(
          JSON.stringify({
            error: "An error occurred while processing the chat",
          })
        );
      }
    });

    socket.on("close", () => {
      log("WebSocket connection closed");
    });
  });
}
