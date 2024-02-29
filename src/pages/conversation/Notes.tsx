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
import { Block, PartialBlock } from "@blocknote/core";
import {
  Json,
  Tables,
  getCurrentDate,
  getSupabaseClient,
} from "@/util/supabase";
import { parse } from "path";

type NotesProps = {
  conversationID: string | undefined;
  notes?: Tables<"notes">[];
};

function Notes({ conversationID, notes }: NotesProps) {
  // @ts-ignore
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const parseJSONIntoBlocks = () => {
      console.log("first");
      notes?.forEach((note) => {
        var partialBlocks: PartialBlock<any, any, any>[] = [];
        let loadedBlocks = note.blocks;

        // convert loaded block into an array.
        loadedBlocks = JSON.stringify(loadedBlocks);
        try {
          partialBlocks = JSON.parse(loadedBlocks);
        } catch (e) {
          console.log(e);
        }
        console.log("first");
        setBlocks(partialBlocks);
      });
    };
    parseJSONIntoBlocks();
  }, []);

  const editor = useBlockNote({
    onEditorContentChange: (editor) => setBlocks(editor.topLevelBlocks),
    initialContent: blocks,
  });

  // This useEffect's purpose is to remove all the blocks from the editor when the conversationID changes.
  const saveToSupabase = () => {
    console.log("Autosave Start");
    setIsSaving(true);
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
          setIsSaving(false);
        });
    }
  };

  useAutosave({
    data: blocks,
    interval: 1000,
    onSave: () => {
      saveToSupabase();
    },
  });

  return (
    <SheetContent side="notes" className="h-full">
      <SheetHeader>
        <SheetTitle>Your Conversation Notes</SheetTitle>
        <SheetDescription>
          We support Markdown! Press CTRL+S or ⌘+S to save your notes.
        </SheetDescription>
      </SheetHeader>
      <div className="p-2">{isSaving && <h1>Saving</h1>}</div>
      <BlockNoteView editor={editor} theme="light"></BlockNoteView>
    </SheetContent>
  );
}

export default Notes;
