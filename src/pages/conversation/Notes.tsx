import { BlockNoteView, useBlockNote } from "@blocknote/react";

import "@blocknote/react/style.css";
import "./editorstyle.css";

import React, { useEffect, useState } from "react";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetContent,
} from "@/components/ui/sheet";
import { useAutosave } from "react-autosave";
import {
  Block,
  BlockIdentifier,
  BlockNoteEditor,
  PartialBlock,
} from "@blocknote/core";
import { Tables, getCurrentDate, getSupabaseClient } from "@/util/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/util/themeprovider";

type NotesProps = {
  conversationID: string | undefined;
  notes?: Tables<"notes">[];
};

function Notes({ conversationID }: NotesProps) {
  // @ts-ignore
  const [data, setData] = useState<Block[]>([]);
  const [visualTheme, setVisualTheme] = useState<"dark" | "light">("light");

  const supabase = getSupabaseClient();
  const { theme } = useTheme();

  const { toast, dismiss } = useToast();

  useEffect(() => {
    if (theme == "dark") {
      setVisualTheme("dark");
    } else if (theme == "light") {
      setVisualTheme("light");
    }
  }, [theme]);

  // listen for when the user presses CTRL+S or ⌘+S
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        saveNotes.mutate();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const saveNotes = useMutation({
    mutationKey: ["saveNotes"],
    mutationFn: async () => {
      toast({
        title: "✍️ Saving",
        description: "Saving your notes.",
      });
      // delay 500ms
      if (data.length > 0) {
        // @ts-ignore
        const res = await supabase.from("notes").upsert({
          id: conversationID,
          conversation_id: conversationID,
          blocks: data,
          updated_at: getCurrentDate(),
        });
        if (res.error) {
          toast({
            title: "❌ Error",
            description: "Failed to save your notes. Please try again later.",
          });
          throw res.error;
        }
        dismiss();
      }
    },
    onSuccess: () => {
      toast({
        title: "✅ Saved",
        description: "Your notes have been saved!",
        duration: 750,
      });
    },
  });

  const fetchInitialNotes = useQuery({
    queryKey: ["fetchNotes"],
    enabled: false,
    queryFn: async () => {
      // @ts-ignore
      const res = await supabase
        .from("notes")
        .select("*")
        .eq("conversation_id", conversationID ?? "");

      if (res.error) {
        throw res.error;
      }

      return res.data as Tables<"notes">[];
    },
  });

  const editor: BlockNoteEditor = useBlockNote({
    onEditorContentChange: (editor) => setData(editor.topLevelBlocks),
    async onEditorReady(editor) {
      let resBlocks = (await fetchInitialNotes.refetch()).data![0];
      if (resBlocks) {
        // delete all current blocks
        let initBlockIDs: BlockIdentifier[] = [];
        editor.topLevelBlocks.forEach((element) => {
          initBlockIDs.push(element.id);
        });
        editor.removeBlocks(initBlockIDs);

        // loadin blocks from supabase
        var partialBlocks: PartialBlock<any, any, any>[] = [];
        let jsonString = JSON.stringify(resBlocks.blocks);
        partialBlocks = JSON.parse(jsonString);
        editor.insertBlocks(
          // @ts-ignore
          partialBlocks,
          editor.getTextCursorPosition().block,
          "before"
        );
      }
    },
    initialContent: [],
  });

  useAutosave({
    data,
    onSave: () => {
      saveNotes.mutate();
    },
    interval: 10000,
  });

  return (
    <SheetContent side="notes" className="h-full !overflow-auto">
      <SheetHeader>
        <SheetTitle>Your Conversation Notes</SheetTitle>
        <SheetDescription>
          We support Markdown! Press CTRL+S or ⌘+S to save your notes.
        </SheetDescription>
      </SheetHeader>
      <div className="p-2"></div>
      {
        <BlockNoteView
          editor={editor}
          theme={visualTheme}
          data-theming-css
        ></BlockNoteView>
      }
      <Toaster />
    </SheetContent>
  );
}

export default Notes;
