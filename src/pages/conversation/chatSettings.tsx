import React, { useState } from "react";

import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/util/supabase";
import z from "zod";
import { useForm } from "react-hook-form";
import { conversationSettingsChange } from "@/util/zodtypes";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Slider } from "@/components/ui/slider";

type ChatSettingsProps = {
  conversationid: string | undefined;
};

type ConversationSettings = {
  title: string;
  description: string;
  model: string;
  tone: number;
};

/**
 *
 * Hidden page
 * @returns
 */
function ChatSettings({ conversationid }: ChatSettingsProps) {
  const supabase = getSupabaseClient();

  const [description, setDescription] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [tone, setTone] = useState<number[]>([50]);

  const [conversationSettings, setConversationSettings] =
    useState<ConversationSettings>();

  const form = useForm<z.infer<typeof conversationSettingsChange>>({
    resolver: zodResolver(conversationSettingsChange),
    values: {
      description: description,
      model: model,
      title: title,
      tone: tone,
    },
    defaultValues: {
      description: "",
      model: "",
      title: "",
      tone: [50],
    },
  });

  const getChatInformation = useQuery({
    queryKey: [`${conversationid}/chatInformation`],
    queryFn: async () => {
      await supabase
        ?.from("conversations")
        .select()
        .eq("id", conversationid!)
        .then((res) => {
          if (res.error) {
            throw new Error(res.error.message);
          } else {
            return res.data;
          }
        });
    },
  });

  const updateChatInformation = useMutation({
    mutationKey: [`${conversationid}/updateChatInformation`],
    mutationFn: async (data: any) => {
      await supabase
        ?.from("conversations")
        .update(data)
        .eq("id", conversationid!)
        .then((res) => {
          if (res.error) {
            throw new Error(res.error.message);
          } else {
            return res.data;
          }
        });
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Chat Settings</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          className="space-y-2"
          onSubmit={form.handleSubmit((values) => {
            console.log(values);
          })}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Change the title of this conversation."
                    {...field}
                  />
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
                <FormLabel>New Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Change the title of this conversation."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Change the title of this conversation."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Response Type</FormLabel>
                <div className="flex justify-between">
                  <div>Simple</div>
                  <div>More Complex</div>
                </div>
                <FormControl>
                  <Slider
                    step={25}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    asdas
                  </Slider>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}

export default ChatSettings;
