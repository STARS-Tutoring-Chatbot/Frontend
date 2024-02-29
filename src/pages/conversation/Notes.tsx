import { BlockNoteView, useBlockNote } from "@blocknote/react";

import "@blocknote/react/style.css";

import React, { useState } from "react";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetContent,
} from "@/components/ui/sheet";
import { useAutosave } from "react-autosave";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { Tables, getCurrentDate, getSupabaseClient } from "@/util/supabase";

type NotesProps = {
  conversationID: string | undefined;
  notes?: Tables<"notes">[];
};

function Notes({ conversationID }: NotesProps) {
  // @ts-ignore
  const [data, setData] = useState<Block[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const supabase = getSupabaseClient();

  const editor: BlockNoteEditor = useBlockNote({
    onEditorContentChange: (editor) => setData(editor.topLevelBlocks),
    async onEditorReady(editor) {
      await supabase!
        .from("notes")
        .select("*")
        .eq("conversation_id", conversationID ?? "")
        .then((res) => {
          if (res.error) {
            throw res.error;
          } else {
            // @ts-ignore
            let resBlocks = res.data[0].blocks;
            var partialBlocks: PartialBlock<any, any, any>[] = [];
            resBlocks = JSON.stringify(resBlocks);
            partialBlocks = JSON.parse(resBlocks);
            editor.insertBlocks(
              // @ts-ignore
              partialBlocks,
              editor.getTextCursorPosition().block,
              "before"
            );
          }
        });
    },
  });

  // This useEffect's purpose is to remove all the blocks from the editor when the conversationID changes.

  const saveToSupabase = () => {
    console.log("Autosave Start");
    setIsSaving(true);
    if (data.length > 0) {
      // @ts-ignore
      supabase
        .from("notes")
        .upsert({
          id: conversationID,
          conversation_id: conversationID,
          blocks: data,
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
    data,
    onSave: saveToSupabase,
    interval: 1000,
  });

  return (
    <SheetContent side="notes" className="h-full">
      <SheetHeader>
        <SheetTitle
          onClick={() => {
            console.log(editor.topLevelBlocks);
          }}
        >
          Your Conversation Notes
        </SheetTitle>
        <SheetDescription>
          We support Markdown! Press CTRL+S or ⌘+S to save your notes.
        </SheetDescription>
      </SheetHeader>
      <div className="p-2">{isSaving && <h1>Saving</h1>}</div>
      {<BlockNoteView editor={editor} theme="light"></BlockNoteView>}
    </SheetContent>
  );
}

export default Notes;
