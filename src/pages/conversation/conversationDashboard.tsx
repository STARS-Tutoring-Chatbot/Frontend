import { Button } from "@/components/ui/button";
import React from "react";

/**
 *
 * @DEPRECATED
 */
function ConversationDashboard() {
  return (
    <div className="flex h-lvh items-center justify-center gap-2.5 ">
      <Button variant="secondary" disabled>
        <div className="text-xl font-normal leading-7">
          Press CTRL + J for commands
        </div>
      </Button>
    </div>
  );
}

export default ConversationDashboard;
