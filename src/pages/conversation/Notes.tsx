import { BlockNoteView, useBlockNote } from "@blocknote/react";

import "@blocknote/react/style.css";

import React, { useEffect, useState } from "react";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetContent,
  SheetFooter,
} from "@/components/ui/sheet";
import { Autosave, useAutosave } from "react-autosave";
import { Block } from "@blocknote/core";
import { getCurrentDate, getSupabaseClient } from "@/util/supabase";
import { randomInt } from "crypto";

type NotesProps = {
  conversationID: string | undefined;
};

function Notes({ conversationID }: NotesProps) {
  // @ts-ignore
  const [blocks, setBlocks] = useState<Block[]>([]);

  const editor = useBlockNote({});

  // This useEffect's purpose is to remove all the blocks from the editor when the conversationID changes.
  useEffect(() => {
    var removeBlock: string[] = [];
    //@ts-ignore
    blocks.forEach((block: Block) => {
      removeBlock.push(block.id);
    });
    console.log(removeBlock);
    editor.removeBlocks(removeBlock);
  }, [conversationID]);

  editor.onEditorContentChange(() => {});

  useAutosave({
    data: blocks,
    interval: 10000,
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
      <div className="p-2"></div>
      <BlockNoteView editor={editor} theme="light"></BlockNoteView>
    </SheetContent>
  );
}

export default Notes;
