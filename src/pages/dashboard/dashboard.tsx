import React, { useEffect, useState } from "react";
import { Menubar, MenubarMenu } from "@/components/ui/menubar";

import DashboardCard from "@/components/ui/dashboardcard";
import { Tables, getSupabaseClient } from "@/util/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, Plus, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/util/authprovider";
import { Dialog } from "@/components/ui/dialog";
import CreateConversationDialog from "./createConversation";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/ui/darkmodeToggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const supabase = getSupabaseClient();

// TODO: Implement Profile minidropdown menu popover
// TODO: Implement a dropdown for the model add conversation dialog
function Dashboard() {
  const [conversations, setConversations] = useState<
    Tables<"conversations">[] | undefined
  >([]);
  const [filteredConversations, setFilteredConversations] = useState<
    Tables<"conversations">[] | undefined
  >([
    {
      title: null,
      description: null,
      model: null,
      created_at: "",
      id: "",
      owner_id: "",
      last_viewed: "",
    },
  ]);
  const [search, setSearch] = useState("");
  const [newConversationDialogOpen, setNewConversationDialogOpen] =
    useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    console.log(auth.session);
  }, []);

  const { data, error, isFetching } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 1000));
      const res = await supabase
        ?.from("conversations") // THROW ERROR HERE
        .select("*")
        .eq("owner_id", auth.user?.id ?? "");
      if (res?.error) {
        throw res.error;
      }
      return res?.data as Tables<"conversations">[];
    },
    retry: 3,
  });

  useEffect(() => {
    setConversations(data);
    setFilteredConversations(
      data?.sort((a, b) => {
        if (a.last_viewed! < b.last_viewed!) {
          return 1;
        } else {
          return -1;
        }
      })
    );
  }, [data]);

  useEffect(() => {
    if (error) {
      toast({
        title: "An Error has Occured",
        description: "Please try again later.",
        variant: "destructive",
        action: (
          <ToastAction
            altText="Goto schedule to undo"
            onClick={() => {
              navigate(0);
            }}
          >
            Reload
          </ToastAction>
        ),
      });
    }
  }, [error]);

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
  }, [search]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const onLogOutPress = async () => {
    await supabase?.auth.signOut();
  };

  const onSettingsPress = () => {};

  return (
    <div className="flex justify-center h-full">
      <div id="body" className="pt-2 pl-2 pr-2 md:w-1/2 md:pl-0 md:pr-0">
        <div id="utility-card" className="md:mt-8">
          <Card className="space-y-2">
            <CardContent>
              {error && <Toaster />}
              <div
                id="menubar"
                className="justify-between items-center inline-flex w-full mt-6"
              >
                <div className="self-start h-full">
                  <p></p>
                </div>
                <Menubar className="p-0">
                  <MenubarMenu>
                    <ModeToggle variant="ghost" />
                  </MenubarMenu>
                  <MenubarMenu>
                    <Button variant="ghost" disabled onClick={onSettingsPress}>
                      <Settings size={20} />
                    </Button>
                  </MenubarMenu>
                  <MenubarMenu>
                    <Button variant="ghost" onClick={onLogOutPress}>
                      <LogOut size={18} />
                    </Button>
                  </MenubarMenu>
                </Menubar>
              </div>
            </CardContent>

            <CardContent>
              <div id="page-heading" className="mt-3">
                <div className="text-5xl font-extrabold leading-10 py-2">
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
                onClick={() => {
                  setNewConversationDialogOpen(true);
                }}
              >
                <div>New Conversation</div>
              </Button>
            </CardContent>
          </Card>
        </div>
        <div id="card" className="overflow-y-auto">
          <ScrollArea>
            {!isFetching &&
              filteredConversations?.map((conversation) => (
                <DashboardCard
                  key={conversation.id}
                  title={conversation.title}
                  description={conversation.description}
                  model={conversation.model}
                  created_at={conversation.created_at}
                  conversation_id={conversation.id}
                />
              ))}
            {isFetching && (
              <DashboardCard
                key=""
                title=""
                description=""
                model=""
                created_at=""
                conversation_id=""
                isLoading={true}
              />
            )}
          </ScrollArea>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger className="w-full">
                <Button className="w-full" variant="outline" disabled>
                  Deleted Conversations
                </Button>
                <TooltipContent>
                  <p>Under Construction</p>
                </TooltipContent>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="h-[200px] w-100"></div>
      </div>
      <Dialog
        open={newConversationDialogOpen}
        onOpenChange={setNewConversationDialogOpen}
      >
        <CreateConversationDialog
          setNewConversationDialogOpen={setNewConversationDialogOpen}
        />
      </Dialog>
    </div>
  );
}

export default Dashboard;
