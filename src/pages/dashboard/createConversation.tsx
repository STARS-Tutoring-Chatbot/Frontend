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
import { useMutation, useQuery } from "@tanstack/react-query";
import { create } from "domain";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

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

  const auth = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
      toast({
        title: "An Error has Occured",
        description: "Please try again later",
        variant: "destructive",
      });
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
      <div className="absolute bottom-0 right-0">
        <Toaster></Toaster>
      </div>

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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GPT-3.5-Turbo">
                        GPT-3.5-Turbo
                      </SelectItem>
                      <SelectItem value="OP-SYS-1-3.5">OP-SYS-1-3.5</SelectItem>
                      <SelectItem value="DSA-1-3.5">DSA-1-3.5</SelectItem>
                      <SelectItem value="PROG1-4.0">PROG1-4.0</SelectItem>
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
          <div className="p-4" />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </DialogContent>
  );
}

export default CreateConversationDialog;
