type OpenAIMessage = {
  content: string;
  role: string;
};

type Choice = {
  finish_reason: string;
  index: number;
  message: OpenAIMessage;
  logprobs: null | object;
};

type Usage = {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
};

export type OpenAIResponse = {
  choices: Choice[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: Usage;
};

export type ConversationSelect = {
  name: String;
  desc: String;
  id: String;
  date: Date;
};
