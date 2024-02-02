/**
 * This might get depracted. We still have to figure out the OpenAI Message return type and message types.
 */

// Helper type for OpenAIResponse
type OpenAIMessage = {
  content: string;
  role: string;
};

// Helper type for OpenAIResponse
type Choice = {
  finish_reason: string;
  index: number;
  message: OpenAIMessage;
  logprobs: null | object;
};

// Helper type for OpenAIResponse
type Usage = {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
};

// Helper type for OpenAIResponse
export type OpenAIResponse = {
  choices: Choice[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: Usage;
};

// UI Data types for navbar and defines props that is needed for message window to work
export type ConversationInformation = {
  created_at: string;
  description: string;
  id: string;
  owner_id: string;
  title: string;
};

export type UserMessage = {
  uid: String;
  conversation_id: String;
  messageContent: String;
  date: Date;
};
