import { Textarea } from "@/components/ui/textarea";
import { getOpenAIResponse } from "@/util/openai.dev";
import { Database, Tables, getSupabaseClient } from "@/util/supabase";
import { Send, Pencil, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { z } from "zod";

import { v4 as uuidv4 } from "uuid";
import Notes from "./Notes";
import { useMutation, useQuery } from "@tanstack/react-query";
import MessageComponent from "../chatbox/messageComponent";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { newMessage } from "@/util/zodtypes";
import MessageComponentOtherStates from "../chatbox/messageComponentOtherStates";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ModeToggle } from "@/components/ui/darkmodeToggle";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ImperativePanelHandle } from "react-resizable-panels";

const supabase = getSupabaseClient();

export function collapsePanel(ref: ImperativePanelHandle | null) {
  if (ref) {
    if (ref.isCollapsed()) {
      ref.expand();
    } else {
      ref.collapse();
    }
  }
}

function MessageWindow() {
  // TODO: figure out the performance

  const { toast } = useToast();

  const notesRef = useRef<ImperativePanelHandle>(null);

  // TODO: figure out the message type
  const [messages, setMessages] = useState<Tables<"Messages">[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [sendDisabled, setSendDisabled] = useState<boolean>(true);
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const lowestDiv = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof newMessage>>({
    defaultValues: {
      messsage: "",
    },
    values: {
      messsage: userInput,
    },
  });

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

      const result = await axios({
        method: "post",
        url: "http://127.0.0.1:8000/api/response",
        data: messages,
        params: {
          conversation_id: conversationid,
        },
      }).then(async (res) => {
        if (res.status != 200) {
          throw new Error("Bad Request, Try Again later");
        }
        const openaiMetadata: Tables<"OpenAI-Responses"> = res.data.metadata;
        const openAIResponseMessage: Tables<"Messages"> = res.data.message;

        // @ts-ignore
        const messagesInsertion = await supabase
          ?.from("Messages")
          // @ts-ignore
          .insert([newMessage, openAIResponseMessage]);

        // @ts-ignore
        const metadataInsertion = await supabase
          ?.from("OpenAI-Responses")
          .insert([openaiMetadata]);

        //@ts-ignore
        if (messagesInsertion.error || metadataInsertion.error) {
          throw new Error("Failed to insert into database");
        }

        return {
          metadata: openaiMetadata,
          message: openAIResponseMessage,
        };
      });

      return result;
    },
    onSuccess(data) {
      setUserInput("");
      data;
      setMessages((prev) => [...prev, data.message]);
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

  return (
    <div className="flex justify-center items-center !h-screen !overflow-x-hidden">
      <ResizablePanelGroup direction="horizontal">
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
              <ModeToggle variant="outline" />
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
                  collapsePanel(notesRef.current);
                }}
                variant="outline"
              >
                <Pencil size={12} />
              </Button>
            </div>
          </div>
        </div>
        <ResizablePanel className="!overflow-auto pr-1 mr-1 flex justify-center ">
          <div id="left" className="max-w-3xl ">
            {!getInitialMessage.isFetching && (
              <div className="mb-32 pt-4 pb-32">
                {getInitialMessage.isLoading && <p>Preparing...</p>}
                {messages?.map((e) => {
                  if (e.role == "system") {
                    return;
                  }
                  if (e.role == "assistant") {
                    return (
                      <MessageComponent
                        key={e.id}
                        isLoading={false}
                        message={e}
                      />
                    );
                  } else {
                    return (
                      <MessageComponent
                        key={e.id}
                        isLoading={false}
                        message={e}
                      />
                    );
                  }
                })}
                {sendMessage.isPending && (
                  <MessageComponentOtherStates
                    isError={false}
                    errorMessage=""
                    isLoading={sendMessage.isPending}
                  />
                )}
                {sendMessage.isError && (
                  <MessageComponentOtherStates
                    isError={sendMessage.isError}
                    errorMessage=""
                    isLoading={false}
                  />
                )}
                <div ref={lowestDiv} />
              </div>
            )}

            <div
              className="fixed flex inset-x-0 bottom-0 w-full items-center space-x-2 bg-transparent z-10 px-4 shadow-md justify-center bg-gradient-to-t from-background to-transparent"
              id="message-input"
            >
              <div className="flex items-center space-x-2 p-4 w-[768px]">
                <Form {...form}>
                  <form
                    className="flex w-full items-center space-x-2"
                    onSubmit={form.handleSubmit((values) => {
                      if (values.messsage.length != 0) {
                        setUserInput(values.messsage);
                        form.reset();
                        sendMessage.mutate();
                      } else {
                        toast({
                          title: "❌ Message Can not be empty.",
                        });
                      }
                    })}
                  >
                    <FormField
                      control={form.control}
                      name="messsage"
                      render={({ field }) => (
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Type your message here."
                            className="w-full text-base block "
                            rows={3}
                          />
                        </FormControl>
                      )}
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={sendMessage.isPending || sendMessage.isError}
                    >
                      <Send size={14} />
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          maxSize={50}
          className="!overflow-auto pb-32 "
          collapsible
          ref={notesRef}
        >
          <div id="right">
            <Notes conversationID={conversationid}></Notes>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default MessageWindow;
