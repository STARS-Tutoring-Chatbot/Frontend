import { Button } from "@/components/ui/button";
import React from "react";

function ConversationDashboard() {
  return (
    <div className="h-lvh gap-2.5 flex justify-center items-center gap-2.5 inline-flex h-max">
      <Button variant="secondary" disabled>
        <div className="text-xl font-normal leading-7">
          Press CTRL + J for commands
        </div>
      </Button>
    </div>
  );
}

export default ConversationDashboard;
