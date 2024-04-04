import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/util/authprovider";
import { getCurrentDate, getSupabaseClient } from "@/util/supabase";
import { newConversation } from "@/util/zodtypes";
import React, { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { OpenAIPromptMessage } from "@/util/openai.dev";
import { useMutation } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const supabase = getSupabaseClient();

function CreateConversationDialog({
  setNewConversationDialogOpen,
}: {
  setNewConversationDialogOpen: (open: boolean) => void;
}) {
  const [createNewConversationDisabled, setCreateNewConversationDisabled] =
    useState(false);
  const [model, setModel] = useState<string>("");
  const [conversationName, setConversationName] = useState("");
  const [conversationDescription, setConversationDescription] = useState("");
  const [isGPT4, setIsGPT4] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Hello");
    if (model.includes("gpt-4")) {
      setIsGPT4(true);
    } else {
      setIsGPT4(false);
    }
  }, [model]);

  const createConversation = useMutation({
    mutationKey: ["conversations"],
    mutationFn: async (values: z.infer<typeof newConversation>) => {
      let newConversationResponse;
      let newMessageResponse;
      const uid = uuidv4();
      //@ts-ignore
      await supabase
        .from("conversations")
        .insert({
          id: uid,
          owner_id: auth.user?.id ?? "",
          title: values.title,
          description: values.description,
          model: values.model,
        })
        .then((res) => {
          if (res.error) {
            throw new Error(res.error.message);
          }
          newConversationResponse = res.data;
        });

      //@ts-ignore
      await supabase
        .from("Messages")
        .insert({
          id: uuidv4(),
          content:
            OpenAIPromptMessage +
            "\n\nTitle:" +
            values.title +
            "\n\n" +
            values.description,
          conversation_id: uid,
          role: "system",
          created_at: getCurrentDate(),
        })
        .then((res) => {
          if (res.error) {
            throw new Error(res.error.message);
          }
          newMessageResponse = res.data;
        });

      console.log({ newConversationResponse, newMessageResponse });
      return { newConversationResponse, newMessageResponse };
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      setNewConversationDialogOpen(false);
      navigate(0);
    },
  });

  const form = useForm<z.infer<typeof newConversation>>({
    resolver: zodResolver(newConversation),
    defaultValues: {
      title: "",
      description: "",
      model: "",
    },
    values: {
      title: conversationName,
      description: conversationDescription,
      model: model,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (conversationName && conversationDescription && model) {
      setCreateNewConversationDisabled(false);
    } else {
      setCreateNewConversationDisabled(true);
    }
  }, [model, conversationName, conversationDescription]);

  return (
    <DialogContent>
      <DialogTitle>Create New Conversation</DialogTitle>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            createConversation.mutate(values);
          })}
          className="space-y-2"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conversation Title</FormLabel>
                <FormControl>
                  <Input placeholder="(Max 100 Characters)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="(Max 500 Characters)" {...field} />
                </FormControl>
                <FormDescription>
                  This helps the model understand the context of the
                  conversation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              // TODO: Add model selection from the supabase database. However, for now, we will use a static list of models.
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (value.includes("gpt-4")) {
                        setIsGPT4(true);
                      } else {
                        setIsGPT4(false);
                      }
                    }}
                    defaultValue={field.value}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-3.5-turbo">
                        GPT-3.5-Turbo
                      </SelectItem>
                      <SelectItem value="gpt-4-turbo-preview">
                        GPT-4-Turbo-Preview
                      </SelectItem>
                      <SelectItem value="gpt-4-0125-preview">
                        GPT-4-0125-Preview
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  This helps the model understand the context of the
                  conversation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <p>
            {isGPT4 ? (
              <Alert>
                <Info />
                <AlertTitle className="pb-0">You are using GPT-4</AlertTitle>
                <AlertDescription>
                  The GPT-4 model is a more accurate and powerful model.
                  However, you will get longer response times.
                </AlertDescription>
              </Alert>
            ) : (
              ""
            )}
          </p>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}

export default CreateConversationDialog;
