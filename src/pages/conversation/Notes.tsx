import { BlockNoteView, useBlockNote } from "@blocknote/react";

import "@blocknote/react/style.css";

import React, { useEffect, useState } from "react";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetContent,
} from "@/components/ui/sheet";
import { useAutosave } from "react-autosave";
import { Block } from "@blocknote/core";
import {
  Json,
  Tables,
  getCurrentDate,
  getSupabaseClient,
} from "@/util/supabase";
import { json } from "stream/consumers";

type NotesProps = {
  conversationID: string | undefined;
  notes?: Tables<"notes">[];
};

function Notes({ conversationID, notes }: NotesProps) {
  // @ts-ignore
  const [blocks, setBlocks] = useState<Block[]>([]);

  const editor = useBlockNote({});

  // This useEffect's purpose is to remove all the blocks from the editor when the conversationID changes.
  useEffect(() => {
    // this only runs once because there are at most 1 notes.
    console.log("I hate myself");
    notes?.forEach((note) => {
      console.log(note);
    });
  }, []);

  editor.onEditorContentChange(() => {});

  useAutosave({
    data: blocks,
    interval: 1000,
    onSave: () => {
      console.log("Autosave Start");
      const supabase = getSupabaseClient();
      if (blocks.length > 0) {
        supabase
          .from("notes")
          .upsert({
            id: conversationID,
            conversation_id: conversationID,
            blocks: blocks,
            updated_at: getCurrentDate(),
          })
          .then((res) => {
            if (res.error) {
              throw res;
            }
            console.log("Autosave Complete");
            console.log(res.data);
          });
      }
    },
  });

  editor.onEditorContentChange(() => {
    // @ts-ignore
    var b: Block = [];
    // @ts-ignore
    editor.topLevelBlocks.forEach((block) => {
      b.push(block);
    });
    setBlocks(b);
  });

  return (
    <SheetContent side="notes" className="h-full">
      <SheetHeader>
        <SheetTitle>Your Conversation Notes</SheetTitle>
        <SheetDescription>
          We support Markdown! Press CTRL+S or ⌘+S to save your notes.
        </SheetDescription>
      </SheetHeader>
      <div className="p-2">{JSON.stringify(notes)}</div>
      <BlockNoteView editor={editor} theme="light"></BlockNoteView>
    </SheetContent>
  );
}

export default Notes;
