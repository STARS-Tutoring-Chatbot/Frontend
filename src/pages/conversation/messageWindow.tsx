import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tables, getSupabaseClient } from "@/util/supabase";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const supabase = getSupabaseClient();

function MessageWindow() {
  // TODO: figure out the message type
  const [messages, setMessages] = useState<any[] | null>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { conversationid } = useParams();

  useEffect(() => {
    const fetchMessages = async () => {
      await supabase
        .from("Messages")
        .select("*")
        .eq("conversation_id", conversationid ?? "")
        .then((res) => {
          setMessages(res.data);
          setLoading(false);
        });
    };
    fetchMessages();
  }, [conversationid]);

  async function handleSendMessage(message: Tables<"Messages">) {}

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-0" id="messaging-window">
        {loading ? (
          <div>Loading</div>
        ) : (
          messages?.map((e) => {
            // Once message component is finished loading, inject into page
            return <div key={e.role}>{e.content}</div>;
          })
        )}
        fsfsdf
      </div>
      <div className="p-4 w-full" id="message-input">
        <div className="flex w-full items-center space-x-2">
          <Textarea
            placeholder="Type your message here."
            className="w-full text-base block min-h-[5]"
            rows={3}
          />
          <Button type="submit">
            <PaperPlaneIcon />
          </Button>
        </div>
      </div>
    </>
  );
}

export default MessageWindow;
