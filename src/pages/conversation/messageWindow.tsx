import { Textarea } from "@/components/ui/textarea";
import { getOpenAIResponse } from "@/util/openai.dev";
import { Tables, getSupabaseClient } from "@/util/supabase";
import { Send, Pencil, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [notes, setNotes] = useState<Tables<"notes">[]>();

  const lowestDiv = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { conversationid } = useParams();

  useEffect(() => {
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

      await supabase
        .from("notes")
        .select("*")
        .eq("conversation_id", conversationid ?? "")
        .then((res) => {
          if (res.error) {
            throw res.error;
          }
          setNotes(res.data);
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

  async function handleSendMessage() {
    setLoading(true);
    setSendDisabled(true);
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
      return;
    }
    const openAIResponseMessage: Tables<"Messages"> | null =
      openAIResponse.message;

    const openaiMetadata: Tables<"OpenAI-Responses"> | null =
      openAIResponse.metadata;

    const insert = async () => {
      await supabase
        .from("Messages")
        .insert([newMessage, openAIResponseMessage!])
        .then((res) => {
          if (res.error) {
            throw res.error;
          }

          setMessages((previous) => [...previous, openAIResponseMessage!]);
          setLoading(false);
          setSendDisabled(false);
        });

      await supabase.from("OpenAI-Responses").insert(openaiMetadata!);
    };

    insert();
    setUserInput("");
  }

  return (
    <div className="h-full flex justify-center items-center">
      <Sheet
        open={openSheet}
        onOpenChange={(state) => {
          setOpenSheet(state);
        }}
      >
        <Notes notes={notes} conversationID={conversationid}></Notes>
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

      <ScrollArea className="mb-32 w-1/2 pt-4">
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
        {loading && <p>Loading</p>}
        <div ref={lowestDiv} />
      </ScrollArea>

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
          <Button onClick={handleSendMessage} disabled={sendDisabled}>
            <Send size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MessageWindow;
