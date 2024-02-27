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
import { getSupabaseClient } from "@/util/supabase";
import { newConversation } from "@/util/zodtypes";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

  async function onSubmit(values: z.infer<typeof newConversation>) {
    console.log(values);
    await supabase
      .from("conversations")
      .insert({
        owner_id: auth.user?.id ?? "",
        title: values.title,
        description: values.description,
        model: values.model,
      })
      .then((res) => {
        if (res.error) {
          throw res.error;
        } else {
          setNewConversationDialogOpen(false);
          navigate(0);
        }
      });
  }

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                  <Select {...field}>
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </DialogContent>
  );
}

export default CreateConversationDialog;
