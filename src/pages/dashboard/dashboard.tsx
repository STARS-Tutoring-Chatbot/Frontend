import React, { useEffect, useState } from "react";
import { Menubar, MenubarMenu } from "@/components/ui/menubar";

import DashboardCard from "@/components/ui/dashboardcard";
import { Tables, getSupabaseClient } from "@/util/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, Plus } from "lucide-react";
import { useAuth } from "@/util/authprovider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const supabase = getSupabaseClient();

// TODO: Implement Profile minidropdown menu popover
// TODO: Implement a dropdown for the model add conversation dialog
function Dashboard() {
  const [conversations, setConversations] = useState<
    Tables<"conversations">[] | undefined
  >([]);
  const [filteredConversations, setFilteredConversations] = useState<
    Tables<"conversations">[] | undefined
  >([]);
  const [search, setSearch] = useState("");
  const [newConversationDialogOpen, setNewConversationDialogOpen] =
    useState<boolean>(false);

  const [createNewConversationDisabled, setCreateNewConversationDisabled] =
    useState(true);
  const [model, setModel] = useState<string>("");

  const [conversationName, setConversationName] = useState("");
  const [conversationDescription, setConversationDescription] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await supabase
        .from("conversations")
        .select("*")
        .eq("owner_id", auth.user?.id ?? "")
        .then(({ data, error }) => {
          if (error) {
            throw error;
          }
          setConversations(data);

          // call setFilteredConversations to filteredConversations where it is sorted in reverse order by created_at date
          setFilteredConversations(
            data?.sort((a, b) => {
              if (a.created_at < b.created_at) {
                return 1;
              } else {
                return -1;
              }
            })
          );
        });
    };
    fetchData();

    // set filteredConversations to filteredConversations where it is sorted in reverse order

    console.log(filteredConversations);
  }, []);

  useEffect(() => {
    const filterConversations = () => {
      // Implement this
      const filteredConvo = conversations?.filter(
        (conversation) =>
          conversation.title?.toLowerCase().includes(search.toLowerCase()) ||
          conversation.description?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredConversations(filteredConvo);
    };
    filterConversations();
    console.log(filteredConversations);
  }, [search]);

  useEffect(() => {
    if (conversationName && conversationDescription && model) {
      setCreateNewConversationDisabled(false);
    } else {
      setCreateNewConversationDisabled(true);
    }
  }, [model, conversationName, conversationDescription]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

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

  const onLogOutPress = async () => {
    await supabase.auth.signOut();
    console.log("Logged out");
  };

  const onSettingsPress = () => {
    // TODO: Implement settings
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
    <div className="flex justify-center overflow-none">
      <div id="body" className="w-full md:w-1/2">
        <div id="utility-card" className="mt-8">
          <Card className="space-y-2">
            <CardContent>
              <div
                id="menubar"
                className="justify-between items-center inline-flex w-full mt-6"
              >
                <div className="self-start h-full">
                  <p>FIU STARS Tutoring</p>
                </div>
                <Menubar>
                  <MenubarMenu>
                    <Button variant="ghost">Settings</Button>
                  </MenubarMenu>
                  <MenubarMenu>
                    <Button variant="ghost" onClick={onLogOutPress}>
                      Log Out
                    </Button>
                  </MenubarMenu>
                </Menubar>
              </div>
            </CardContent>

            <CardContent>
              <div id="page-heading" className="mt-3">
                <div className="text-black text-5xl font-extrabold leading-10 py-2">
                  Your Conversations
                </div>
                <div>Signed in as {auth.user?.email}</div>
              </div>
            </CardContent>

            <CardContent className="flex items-center space-x-3">
              <SearchIcon size={16} />
              <Input
                placeholder="Search for conversation by title or description."
                onChange={handleInputChange}
                className=""
              />
            </CardContent>

            <CardContent>
              <Button
                className="w-full mb-6 space-x-2"
                variant="default"
                onClick={() => {
                  setNewConversationDialogOpen(true);
                }}
              >
                <Plus size={16} />
                <p>New Conversation</p>
              </Button>
            </CardContent>
          </Card>
        </div>
        <div id="card" className="overflow-y-auto">
          <ScrollArea>
            {filteredConversations?.map((conversation) => (
              <DashboardCard
                key={conversation.id}
                title={conversation.title}
                description={conversation.description}
                model={conversation.model}
                created_at={conversation.created_at}
                conversation_id={conversation.id}
              />
            ))}
          </ScrollArea>
          <Button className="w-full" variant="outline">
            Deleted Conversations
          </Button>
        </div>
        <div className="h-[200px] w-100"></div>
      </div>
      <Dialog
        open={newConversationDialogOpen}
        onOpenChange={setNewConversationDialogOpen}
      >
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
            placeholder="Input Conversation Name"
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
      </Dialog>
    </div>
  );
}

export default Dashboard;
