import { Textarea } from "@/components/ui/textarea";
import { Tables, getSupabaseClient } from "@/util/supabase";
import { Send, Pencil, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { z } from "zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import ChatSettings from "./chatSettings";

const supabase = getSupabaseClient();

function MessageWindow() {
  // TODO: figure out the performance

  const { toast } = useToast();

  // TODO: figure out the message type
  const [messages, setMessages] = useState<Tables<"Messages">[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [_, setSendDisabled] = useState<boolean>(true);
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);

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

  useQuery({
    queryKey: ["checkConversationID"],
    queryFn: async () => {
      // @ts-ignore
      const res = await supabase
        .from("conversations")
        .select()
        .eq("id", conversationid ?? "");

      if (res.error) {
        navigate("/chat");
      }
    },
  });

  // inital state
  const getInitialMessage = useQuery({
    queryKey: ["fetchMessages"],
    queryFn: async () => {
      // @ts-ignore
      const res = await supabase
        .from("Messages")
        .select("*")
        .eq("conversation_id", conversationid ?? "");

      if (res.error) {
        throw res.error;
      }
      return res.data;
    },
  });

  const getConversationData = useQuery({
    queryKey: ["fetchConversationData"],
    queryFn: async () => {
      // @ts-ignore
      const res = await supabase
        .from("conversations")
        .select()
        .eq("id", conversationid ?? "");

      if (res.error) {
        throw res.error;
      }
      return res.data as Tables<"conversations">[];
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

      const newMessagesInsertion = await supabase
        ?.from("Messages")
        // @ts-ignore
        .insert([newMessage]);

      const result = await axios({
        method: "post",
        url: `${import.meta.env.VITE_BACKEND_LINK}/api/response`,
        data: messages,
        params: {
          conversation_id: conversationid,
          model: getConversationData.data?.[0].model,
        },
      }).then(async (res) => {
        if (res.status != 200) {
          throw new Error("Bad Request, Try Again later");
        }
        const openaiMetadata: Tables<"OpenAI-Responses"> = res.data.metadata;
        const openAIResponseMessage: Tables<"Messages"> = res.data.message;

        // @ts-ignore
        // TODO: before openAI response, push user msg to DB
        const openAIMessagesInsertion = await supabase
          ?.from("Messages")
          // @ts-ignore
          .insert([openAIResponseMessage]);

        // @ts-ignore
        const metadataInsertion = await supabase
          ?.from("OpenAI-Responses")
          // @ts-ignore
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
    <div className="h-full flex justify-center items-center">
      <Toaster />

      <Dialog
        open={openSettings}
        onOpenChange={(state) => {
          setOpenSettings(state);
        }}
      >
        <DialogContent>
          <ChatSettings conversationid={conversationid ?? ""} />
        </DialogContent>
      </Dialog>

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
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <ModeToggle variant="outline" />
                  <TooltipContent>
                    <p>Change Visual Mode</p>
                  </TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Button
                    variant="outline"
                    disabled
                    onClick={() => {
                      setOpenSettings(true);
                    }}
                  >
                    Chat Settings
                  </Button>
                  <TooltipContent>
                    <p>Under Construction</p>
                  </TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Button
                    onClick={() => {
                      setOpenSheet(true);
                    }}
                    variant="outline"
                  >
                    <Pencil size={12} />
                  </Button>
                  <TooltipContent>
                    <p>Conversation Notes</p>
                  </TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      {!getInitialMessage.isFetching && (
        <div className="mb-32 w-1/2 pt-4">
          {getInitialMessage.isLoading && <p>Preparing...</p>}
          {messages?.map((e) => {
            if (e.role == "system") {
              return;
            }
            if (e.role == "assistant") {
              return (
                <MessageComponent key={e.id} isLoading={false} message={e} />
              );
            } else {
              return (
                <MessageComponent key={e.id} isLoading={false} message={e} />
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
        className="fixed flex inset-x-0 bottom-0 w-full items-center space-x-2  bg-transparent z-10 px-4 shadow-md justify-center bg-gradient-to-t from-background to-transparent"
        id="message-input"
      >
        <div className="flex w-1/2 items-center space-x-2 p-4 ">
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
  );
}

export default MessageWindow;
