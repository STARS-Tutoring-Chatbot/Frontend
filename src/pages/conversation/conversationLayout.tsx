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
import MessageWindow from "./messageWindow";
import { ExitIcon, PlusIcon } from "@radix-ui/react-icons";
import { Session, createClient } from "@supabase/supabase-js";
import { useAuth } from "@/util/authprovider";
import {
  Database,
  Tables,
  Enums,
  getSupabaseClient,
  getCurrentDate,
} from "@/util/supabase";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
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
  const auth = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

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

  const onSelectConversationChange = (value: string) => {
    setCurrentConversation(value);
  };

  const onAddConversation = () => {
    // Launch a dialog
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 flex justify-between shadow-md mb-4 h-20" id="navbar">
        <div className="grow shrink basis-0 self-stretch p-2 justify-start items-center gap-12 flex">
          <Dialog>
            <DialogTrigger>
              <Button>
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
              <Input placeholder="Conversation Name" />
              <Textarea placeholder="Short description of conversation" />
              <Button>Create New Conversation</Button>
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
      <Outlet />
    </div>
  );
}

export default NavbarLayout;
