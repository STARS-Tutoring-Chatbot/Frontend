import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const supabase = getSupabaseClient();

function CreateConversationDialog({
  setNewConversationDialogOpen,
}: {
  setNewConversationDialogOpen: (open: boolean) => void;
}) {
  const [createNewConversationDisabled, setCreateNewConversationDisabled] =
    useState(true);
  const [model, setModel] = useState<string>("");
  const [conversationName, setConversationName] = useState("");
  const [conversationDescription, setConversationDescription] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (conversationName && conversationDescription && model) {
      setCreateNewConversationDisabled(false);
    } else {
      setCreateNewConversationDisabled(true);
    }
  }, [model, conversationName, conversationDescription]);

  const handleConversationNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConversationName(event.target.value);
  };

  const handleConversationDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setConversationDescription(event.target.value);
  };

  const handleModelChange = (str: string) => {
    setModel(str);
  };

  const onCreateConversationPress = async () => {
    if (auth.user === null) {
      console.log("Not Logged in");
      return;
    }
    await supabase
      .from("conversations")
      .insert({
        owner_id: auth.user?.id ?? "",
        title: conversationName,
        description: conversationDescription,
        model: model,
      })
      .then((res) => {
        if (res.error) {
          throw res.error;
        } else {
          setNewConversationDialogOpen(false);
          navigate(0);
        }
      });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>New Conversation</DialogTitle>
        <DialogDescription>
          Please fill out the following fields.
        </DialogDescription>
      </DialogHeader>
      <Input
        placeholder="Conversation Name"
        value={conversationName}
        onChange={handleConversationNameChange}
      />
      <Textarea
        placeholder="Conversation Description"
        value={conversationDescription}
        onChange={handleConversationDescriptionChange}
      ></Textarea>
      <div className="pt-4">
        Please select the model for your specifc course.
      </div>
      <Select value={model} onValueChange={handleModelChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="GPT-3.5-Turbo">GPT-3.5-Turbo</SelectItem>
          <SelectItem value="OP-SYS-1-3.5">OP-SYS-1-3.5</SelectItem>
          <SelectItem value="DSA-1-3.5">DSA-1-3.5</SelectItem>
          <SelectItem value="PROG1-4.0">PROG1-4.0</SelectItem>
        </SelectContent>
      </Select>
      <Button
        disabled={createNewConversationDisabled}
        onClick={onCreateConversationPress}
      >
        Create New Conversation
      </Button>
    </DialogContent>
  );
}

export default CreateConversationDialog;
