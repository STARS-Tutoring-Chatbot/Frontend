import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Outlet, useNavigate } from "react-router-dom";
import { ExitIcon, PlusIcon } from "@radix-ui/react-icons";
import { Session } from "@supabase/supabase-js";
import { useAuth } from "@/util/authprovider";
import { Tables, getCurrentDate, getSupabaseClient } from "@/util/supabase";
import { v4 as uuidv4 } from "uuid";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const supabase = getSupabaseClient();

// TODO: create a
function NavbarLayout() {
  const [userConversations, setUserConversations] =
    useState<Tables<"conversations">[]>();
  const [currentConversation, setCurrentConversation] = useState<string>("");
  const [session, setSession] = useState<Session | null>();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [inputConversationName, setInputConversationName] =
    useState<string>("");
  const [inputConversationDesc, setInputConversationDesc] =
    useState<string>("");
  const auth = useAuth();
  const navigate = useNavigate();

  // on page load
  useEffect(() => {
    setSession(auth.session);
    const fetchConversations = async () => {
      await supabase
        .from("conversations")
        .select("*")
        .eq("owner_id", auth.user?.id ?? "")
        .then(({ data, error }) => {
          if (error) {
            throw error;
          }
          setUserConversations(data);
        });
    };
    fetchConversations();

    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    navigate(currentConversation);
  }, [currentConversation]);

  const onInputConversationNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputConversationName(e.target.value);
  };
  const onInputConversationDescChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInputConversationDesc(e.target.value);
  };

  const onSelectConversationChange = (value: string) => {
    setCurrentConversation(value);
  };

  const onAddConversation = () => {
    const uuid = uuidv4();
    const conversationInformation: Tables<"conversations"> = {
      id: uuid,
      created_at: getCurrentDate(),
      description: inputConversationDesc,
      title: inputConversationName,
      owner_id: auth.user?.id ?? "",
    };

    const insert = async () => {
      await supabase
        .from("conversations")
        .insert(conversationInformation)
        .then((value) => {
          if (value.error) {
            throw value.error;
          }
          if (value.status == 201) {
            console.log(value);
            setOpenDialog(false);
            navigate(`${uuid}`);
          }
        });
    };
    insert();
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 flex justify-between shadow-md mb-4 h-20" id="navbar">
        <div className="grow shrink basis-0 self-stretch p-2 justify-start items-center gap-12 flex">
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger>
              <Button
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                <PlusIcon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Conversation</DialogTitle>
                <DialogDescription>
                  Please fill out the following fields.
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Conversation Name"
                value={inputConversationName}
                onChange={onInputConversationNameChange}
              />
              <Textarea
                placeholder="Short description of conversation"
                value={inputConversationDesc}
                onChange={onInputConversationDescChange}
              />
              <Button onClick={onAddConversation}>
                Create New Conversation
              </Button>
            </DialogContent>
          </Dialog>
          <Select
            onValueChange={onSelectConversationChange}
            value={currentConversation}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Conversation" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Put Timestamp and Date Ranges</SelectLabel>
                {userConversations?.map((e: Tables<"conversations">) => {
                  return (
                    <SelectItem value={e.id} key={e.id}>
                      {e.title}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grow shrink basis-0 self-stretch p-2.5 justify-center items-center gap-2.5 flex">
          <div>
            <span className="text-gray-800 text-3xl font-bold  leading-9">
              FIU
            </span>
            <span className="text-gray-800 text-3xl font-normal  leading-9">
              {" "}
            </span>
            <span className="text-gray-800 text-3xl font-light  leading-9">
              STARS GPT
            </span>
          </div>
        </div>
        <div className="grow shrink basis-0 self-stretch p-2.5 justify-end items-center gap-12 flex">
          <div>Welcome, {session?.user.email}</div>
          <Button
            variant="ghost"
            onClick={() => {
              supabase.auth.signOut();
              navigate("/login");
            }}
          >
            <ExitIcon />
          </Button>
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandGroup heading="Conversations">
            {userConversations?.map((e: Tables<"conversations">) => {
              return (
                <CommandItem
                  value={e.id}
                  key={e.id}
                  onSelect={(value) => {
                    setCurrentConversation(value);
                    setOpen(false);
                  }}
                >
                  {e.title}
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandGroup heading="Commands">
            <CommandItem>New Conversation</CommandItem>
            <CommandItem
              onSelect={() => {
                navigate("/chat");
                setOpen(false);
              }}
            >
              Back to Dashboard
            </CommandItem>
            <CommandItem>Settings</CommandItem>
            <CommandItem
              onSelect={() => {
                supabase.auth.signOut();
              }}
            >
              Logout
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
      <Outlet></Outlet>
    </div>
  );
}

export default NavbarLayout;
