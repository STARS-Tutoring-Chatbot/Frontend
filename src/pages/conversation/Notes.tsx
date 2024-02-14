import { BlockNoteView, useBlockNote } from "@blocknote/react";

import "@blocknote/react/style.css";

import React from "react";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetContent,
  SheetFooter,
} from "@/components/ui/sheet";

function Notes() {
  const editor = useBlockNote({});

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
