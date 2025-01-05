import z from "zod";
import fs from "fs";
import { FastifyTypeInstance } from "../types";
import {
  getUserByEmail,
  createUser,
  createChatMessage,
  createThread,
  updateThread,
  generateMenuJson,
} from "../prisma";
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

export async function chat(app: FastifyTypeInstance) {
  app.get("/chat", { websocket: true }, async (socket, _) => {
    // log("WebSocket connection opened");

    // CONSTANTS
    let threadId: string | null = null;
    let userId: string | null | undefined = null;

    // CREATE THREAD AND UPLOAD MENU TO THE THREAD
    if (!threadId) {
      log("Creating new thread");
      const menuFilePath = await generateMenuJson();
      const uploadedMenu = await openai.files.create({
        file: fs.createReadStream(menuFilePath),
        purpose: "assistants",
      });
      const threadResponse = await openai.beta.threads.create({
        messages: [
          {
            role: "assistant",
            content: INITIAL_MESSAGE,
            attachments: [
              { file_id: uploadedMenu.id, tools: [{ type: "file_search" }] },
            ],
          },
        ],
      });
      log("File Uploaded and Thread Created");
      await fs.promises.unlink(menuFilePath);
      log("File Deleted");
      threadId = threadResponse.id;
      socket.send(JSON.stringify({ assistantMessage: INITIAL_MESSAGE }));
      await createThread({ id: threadId });
      await createChatMessage({
        threadId: threadId,
        role: "assistant",
        message: INITIAL_MESSAGE,
      });
    }

    // HANDLE EXTERNAL ACTIONS (CHECK_USER_ACCOUNT, CREATE_USER_ACCOUNT)
    const handleExternalAction = async (run: Run, threadId: string) => {
      if (
        run.required_action &&
        run.required_action.submit_tool_outputs &&
        run.required_action.submit_tool_outputs.tool_calls
      ) {
        const toolOutputs = await Promise.all(
          run.required_action.submit_tool_outputs.tool_calls.map(
            async (tool) => {
              const args = JSON.parse(tool.function.arguments);
              if (tool.function.name === FUNCTION_NAMES.CHECK_USER_ACCOUNT) {
                const user = await getUserByEmail(args);
                userId = user?.id;
                if (user?.id) {
                  updateThread({ id: threadId, userId: user.id });
                }
                return { output: JSON.stringify(user), tool_call_id: tool.id };
              } else if (
                tool.function.name === FUNCTION_NAMES.CREATE_USER_ACCOUNT
              ) {
                const user = await createUser(args);
                updateThread({ id: threadId, userId: user.id });
                userId = user.id;
                return {
                  output: JSON.stringify({ id: user.id }),
                  tool_call_id: tool.id,
                };
              }
            }
          )
        );

        if (toolOutputs.length > 0) {
          run = await openai.beta.threads.runs.submitToolOutputsAndPoll(
            threadId,
            run.id,
            {
              tool_outputs:
                toolOutputs as RunSubmitToolOutputsParams.ToolOutput[],
            }
          );
          log("Tool outputs submitted successfully.");
        } else {
          log("No tool outputs to submit.");
        }
      }
    };

    // CREATE RUN AND HANDLE MESSAGES
    const createRun = async (threadId: string) => {
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
      });
      let status = run.status;
      while (PENDING_RUN_STATUS.includes(status)) {
        const newRun = await openai.beta.threads.runs.retrieve(
          run.thread_id,
          run.id
        );

        if (newRun.status === "requires_action") {
          await handleExternalAction(newRun, threadId);
        } else {
          status = newRun.status;
        }
        log(`Run status: ${status}`);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const messages = await openai.beta.threads.messages.list(threadId);
      const lastMessage =
        messages.data[0].content[0]?.type === "text"
          ? messages.data[0].content[0].text.value
          : "";

      createChatMessage({
        threadId: threadId,
        role: "assistant",
        message: lastMessage,
      });
      return lastMessage;
    };

    socket.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());
        const { userMessage } = z
          .object({
            userMessage: z.string(),
          })
          .parse(data);

        createChatMessage({
          threadId: threadId,
          role: "user",
          message: userMessage,
        });

        await openai.beta.threads.messages.create(threadId, {
          role: "user",
          content: userMessage,
        });

        const assistantMessage = await createRun(threadId);
        socket.send(JSON.stringify({ assistantMessage }));
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
