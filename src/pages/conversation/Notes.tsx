import { Button } from "@/components/ui/button";

import { createReactEditorJS } from "react-editor-js";

const ReactEditorJS = createReactEditorJS();

import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import React from "react";

function Notes() {
  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Your Notes</DrawerTitle>
        <DrawerDescription>
          Take some notes based on the conversation here! We support Markdown!
        </DrawerDescription>
      </DrawerHeader>
      <ReactEditorJS holder="custom">
        <div id="custom"></div>
      </ReactEditorJS>
      <DrawerFooter>
        <DrawerClose>
          <Button variant="outline">Save</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );
}

export default Notes;
