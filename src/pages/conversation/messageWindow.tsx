import { Textarea } from "@/components/ui/textarea";
import { getOpenAIResponse } from "@/util/openai.dev";
import { Database, Tables, getSupabaseClient } from "@/util/supabase";
import { Send, Pencil, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { v4 as uuidv4 } from "uuid";
import Notes from "./Notes";
import { useMutation, useQuery } from "@tanstack/react-query";

const supabase = getSupabaseClient();

function MessageWindow() {
  // TODO: figure out the message type
  const [messages, setMessages] = useState<Tables<"Messages">[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [sendDisabled, setSendDisabled] = useState<boolean>(true);
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const lowestDiv = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { conversationid } = useParams();

  // inital state
  const getInitialMessage = useQuery({
    queryKey: ["fetchMessages"],
    queryFn: async () => {
      // @ts-ignore
      const res = await supabase
        .from("Messages")
        .select("*")
        .eq("conversation_id", conversationid ?? "")
        .order("created_at");

      if (res.error) {
        throw res.error;
      }
      return res.data;
    },
  });

  const sendMessage = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async () => {
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
      messages.push(newMessage);
      setMessages(messages);

      const openAIResponse = await getOpenAIResponse(
        messages,
        conversationid ?? ""
      );

      if (openAIResponse.message == null || openAIResponse.metadata == null) {
        throw new Error("OpenAI response is null");
      }
      const openAIResponseMessage: Tables<"Messages"> | null =
        openAIResponse.message;

      const openaiMetadata: Tables<"OpenAI-Responses"> | null =
        openAIResponse.metadata;

      // @ts-ignore
      const insertionResponse = await supabase
        .from("Messages")
        // @ts-ignore
        .insert([newMessage, openAIResponseMessage!]);
      if (insertionResponse.error) {
        throw insertionResponse.error;
      }
      // @ts-ignore
      const openAI_insertionResponse = await supabase
        .from("OpenAI-Responses")
        .insert([openaiMetadata!]);
      if (openAI_insertionResponse.error) {
        throw openAI_insertionResponse.error;
      }

      return openAIResponse.message;
    },
    onSuccess(data) {
      setUserInput("");
      setMessages((previous) => [...previous, data]);
    },
  });

  useEffect(() => {
    setMessages(getInitialMessage.data ?? []);
  }, [getInitialMessage.data, conversationid]);

  useEffect(() => {
    if (userInput.length == 0) {
      setSendDisabled(true);
    } else {
      setSendDisabled(false);
    }
  }, [userInput]);

  useEffect(() => {
    if (lowestDiv.current) {
      lowestDiv.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);

  function handleUserInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setUserInput(e.target.value);
  }

  return (
    <div className="h-full flex justify-center items-center">
      <Sheet
        open={openSheet}
        onOpenChange={(state) => {
          setOpenSheet(state);
        }}
      >
        <Notes conversationID={conversationid}></Notes>
      </Sheet>

      <div
        id="topbar"
        className="fixed top-0 flex-row w-full items-center space-x-2 bg-transparent z-10 px-4"
      >
        <div className="flex w-full items-center justify-between p-4">
          <Button
            variant="outline"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ChevronLeft size={20} />
          </Button>

          <div id="topbar-button-group-left" className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                console.log(messages[0].content);
                console.log(messages);
              }}
            >
              Chat Settings
            </Button>
            <Button
              onClick={() => {
                setOpenSheet(true);
              }}
              variant={"default"}
            >
              <Pencil size={12} />
            </Button>
          </div>
        </div>
      </div>

      {!getInitialMessage.isFetching && (
        <ScrollArea className="mb-32 w-1/2 pt-4">
          {getInitialMessage.isLoading && <p>Preparing...</p>}
          {messages?.map((e) => {
            if (e.role == "system") {
              return;
            }
            if (e.role == "assistant") {
              return (
                <div key={e.id} className="text-green-900 py-2">
                  <p className="w-full">{e.content}</p>
                </div>
              );
            } else {
              return (
                <div key={e.id} className="py-2">
                  <b>{e.content}</b>
                </div>
              );
            }
          })}
          {sendMessage.isPending && <p>Loading</p>}
          <div ref={lowestDiv} />
        </ScrollArea>
      )}

      <div
        className="fixed inset-x-0 bottom-0 flex w-full items-center space-x-2 bg-white z-10 px-4 shadow-md border-t-2 border-gray-200"
        id="message-input"
      >
        <div className="flex w-full items-center space-x-2 p-4">
          <Textarea
            placeholder="Type your message here."
            className="w-full text-base block"
            rows={3}
            onChange={handleUserInput}
            value={userInput}
          />
          <Button
            onClick={() => {
              sendMessage.mutate();
            }}
            disabled={sendMessage.isPending || sendDisabled}
          >
            <Send size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MessageWindow;
