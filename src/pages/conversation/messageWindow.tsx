import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getOpenAIResponse } from "@/util/openai.dev";
import { Tables, getSupabaseClient } from "@/util/supabase";
import { PaperPlaneIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { v4 as uuidv4 } from "uuid";
import Notes from "./Notes";

const supabase = getSupabaseClient();

function MessageWindow() {
  // TODO: figure out the message type
  const [messages, setMessages] = useState<Tables<"Messages">[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userInput, setUserInput] = useState<string>("");
  const [sendDisabled, setSendDisabled] = useState<boolean>(true);
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const { conversationid } = useParams();

  useEffect(() => {
    // get initial messages.
    const fetchMessages = async () => {
      await supabase
        .from("Messages")
        .select("*")
        .eq("conversation_id", conversationid ?? "")
        .then((res) => {
          if (res.error) {
            throw res.error;
          }
          setMessages(res.data);
          setLoading(false);
        });
    };
    fetchMessages();
  }, [conversationid]);

  useEffect(() => {
    if (userInput.length == 0) {
      setSendDisabled(true);
    } else {
      setSendDisabled(false);
    }
  }, [userInput]);

  function handleUserInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setUserInput(e.target.value);
  }

  async function handleSendMessage() {
    setLoading(true);
    const newMessage: Tables<"Messages"> = {
      content: userInput,
      conversation_id: conversationid ?? "",
      role: "user",
      id: uuidv4(),
      created_at: new Date(
        Date.now() + 1000 * 60 * -new Date().getTimezoneOffset()
      )
        .toISOString()
        .replace("T", " ")
        .replace("Z", ""),
    };
    console.log(newMessage);
    messages.push(newMessage);
    setMessages(messages);

    console.log("messages", messages);

    const openAIResponse = await getOpenAIResponse(
      messages,
      conversationid ?? ""
    );

    if (openAIResponse.message == null || openAIResponse.metadata == null) {
      return;
    }
    const openAIResponseMessage: Tables<"Messages"> | null =
      openAIResponse.message;

    const openaiMetadata: Tables<"OpenAI-Responses"> | null =
      openAIResponse.metadata;

    // I will have to fix the assert not null errors
    const insert = async () => {
      await supabase
        .from("Messages")
        .insert([newMessage, openAIResponseMessage!])
        .then((res) => {
          if (res.error) {
            throw res.error;
          }
          setMessages((previous) => [...previous, openAIResponseMessage!]);
          console.log(messages);
        });

      await supabase.from("OpenAI-Responses").insert(openAIResponse.metadata!);
    };
    insert();
    setLoading(false);
    setUserInput("");
  }

  return (
    <>
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <Notes></Notes>
      </Sheet>
      <div className="flex-1 overflow-y-auto px-4 py-0" id="messaging-window">
        {loading ? (
          <div>Loading</div>
        ) : (
          messages?.map((e) => {
            if (e.role == "assistant") {
              return (
                <div key={e.id} className="text-green-900 ">
                  <pre className="max-w-fit">{e.content}</pre>
                </div>
              );
            } else {
              return (
                <div key={e.id} className="">
                  <b>{e.content}</b>
                </div>
              );
            }
          })
        )}
      </div>
      <div className="p-4 w-full" id="message-input">
        <div className="flex w-full items-center space-x-2">
          <Textarea
            placeholder="Type your message here."
            className="w-full text-base block min-h-[5]"
            rows={3}
            onChange={handleUserInput}
            value={userInput}
          />
          <Button onClick={handleSendMessage} disabled={sendDisabled}>
            <PaperPlaneIcon />
          </Button>
          <Button
            onClick={() => {
              setOpenSheet(true);
            }}
          >
            <Pencil2Icon />
          </Button>
        </div>
      </div>
    </>
  );
}

export default MessageWindow;
