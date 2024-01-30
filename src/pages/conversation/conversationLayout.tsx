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
import { Textarea } from "@/components/ui/textarea";
import { PaperPlaneIcon, PlusIcon, ExitIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

// TODO: work on auth routes
function ConversationLayout() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 flex justify-between shadow-md mb-4 h-20" id="navbar">
        <div className="grow shrink basis-0 self-stretch p-2 justify-start items-center gap-12 flex">
          <Button>
            <PlusIcon />
          </Button>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Conversation" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Put Timestamp and Date Ranges</SelectLabel>
                <SelectItem value="est">1</SelectItem>
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
          <div className="w-10 h-10 relative">
            <div className="w-10 h-10 left-0 top-0 absolute bg-slate-200 rounded-full" />
            <div className="left-[8px] top-[8px] absolute text-slate-900 text-base font-normal  leading-7">
              CN
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              navigate("/login");
            }}
          >
            <ExitIcon />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-0" id="messaging-window">
        Chat Messages
      </div>
      <div className="p-4 w-full" id="message-input">
        <div className="flex w-full items-center space-x-2">
          <Textarea
            placeholder="Type your message here."
            className="w-full text-base resize-none block min-h-[5]"
            rows={1}
          />
          <Button type="submit">
            <PaperPlaneIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConversationLayout;
