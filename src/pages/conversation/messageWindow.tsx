import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ConversationInformation,
  OpenAIResponse,
  UserMessage,
} from "@/util/types";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { createClient } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";

// TODO: add as props: conversation: ConversationInformation | null
function MessageWindow() {
  // TODO: figure out the message type
  const [messages, setMessages] = useState<(UserMessage | OpenAIResponse)[]>(
    []
  );

  useEffect(() => {
    // query Supabase: select * from messages where conversation_id = conversation.id
    // If query returns empty array, invoke empty conversation state.
    // Sort by date
    // load into messages
  }, []);

  async function handleSendMessage(message: any) {
    /**
     * send message to OpenAI and process that response.
     * after response, call setMessages that appends message then OpenAI message
     * display message in UI
     * write to DB
     */
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-0" id="messaging-window">
        Chat Messages
      </div>
      <div className="p-4 w-full" id="message-input">
        <div className="flex w-full items-center space-x-2">
          <Textarea
            placeholder="Type your message here."
            className="w-full text-base block min-h-[5]"
            rows={3}
          />
          <Button type="submit">
            <PaperPlaneIcon />
          </Button>
        </div>
      </div>
    </>
  );
}

export default MessageWindow;
