import { OpenAI } from "openai";
import { Tables } from "./supabase";
import { v4 as uuidv4 } from "uuid";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPEN_AI_DEV_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * @deprecated
 * @param messages
 */
export async function getOpenAIResponse(
  messages: Tables<"Messages">[],
  conversationid: string
): Promise<{
  metadata: Tables<"OpenAI-Responses"> | null;
  message: Tables<"Messages"> | null;
}> {
  const strippedMessages: OpenAI.ChatCompletionMessageParam[] = messages.map(
    (message: Tables<"Messages">) => {
      const msg: OpenAI.ChatCompletionMessageParam = {
        // @ts-ignore ong i hate typescript sometimes
        role: message.role,
        content: message.content,
      };

      return msg;
    }
  );

  var message: Tables<"Messages"> | null = null;
  var metadata: Tables<"OpenAI-Responses"> | null = null;
  // rest

  const testPrompt =
    "Hello! You are my personal coding assistant! Whenever outputing code, please do not say the answer directly. Instead lead me in the correct direction! Also have a very nice tone :)";

  await openai.chat.completions
    .create({
      messages: [{ role: "system", content: testPrompt }, ...strippedMessages],
      model: "gpt-4-turbo-preview",
      n: 1,
    })
    .then((res) => {
      const messageID = uuidv4();
      const metadataID = uuidv4();
      const time = new Date(
        Date.now() + 1000 * 60 * -new Date().getTimezoneOffset()
      )
        .toISOString()
        .replace("T", " ")
        .replace("Z", "")
        .toString();

      message = {
        role: res.choices[0].message.role,
        content: res.choices[0].message.content,
        conversation_id: conversationid,
        created_at: time,
        id: messageID,
      };

      metadata = {
        chat_completion_id: res.id,
        completion_tokens: res.usage?.completion_tokens ?? null,
        created: time,
        id: metadataID,
        message: messageID,
        model: res.model,
        prompt_tokens: res.usage?.prompt_tokens ?? null,
        system_fingerprint: res.system_fingerprint ?? null,
        total_tokens: res.usage?.total_tokens ?? null,
      };
    })
    .catch((err) => {
      message = null;
      metadata = null;
      throw err;
    });

  return {
    message: message,
    metadata: metadata,
  };
}

export const OpenAIPromptMessage =
  "Hello you are a Tutoring Chatbot. You will help the user figure out the answer to their coding problems. You will not give the answer directly. You will guide the user in the right direction. You will also have a very nice tone and helpful tone. Below, is the user's query, it should be a baseline to help you guide the user in the right direction.\n\nUser Query:\n\n";
