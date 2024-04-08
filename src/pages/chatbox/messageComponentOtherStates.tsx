import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";


type MessageComponentOtherStatesProps = {
  isError: boolean;
  isLoading: boolean;
  errorMessage: string;
};

function MessageComponentOtherStates({
  isError,
  isLoading,
  errorMessage,
}: MessageComponentOtherStatesProps) {
  // Loading State
  if (isLoading) {
    // Return a skeleton loading component
  return (
    <div className="flex justify-between items-center w-full">
      <div className = "w-full">
        <div className="text-xl font-semibold mb-2 px-4">Assistant</div>
        <div className="space-y-2 w-full">
          <Skeleton className="h-6" />
          <Skeleton className="h-6" />
          <Skeleton className="h-6" />
          <Skeleton className="h-6" />
        </div>
      </div>
    </div>
    );
  }
  // error state
  else if (isError) {
    if (errorMessage === "") {
      errorMessage = "Something went wrong.";
    }
    const reload = () => {
      window.location.reload();
    };
    return (
      <div className="w-full flex justify-center items-center">
      <div className="flex items-center">
        <AlertTriangle className="text-destructive w-10 h-10" />
        <div className="flex flex-col ml-2">
          <div className="text-destructive text-center">
            Error: {errorMessage}
          </div>
          <Button className="text-sm" variant={"link"} onClick={reload}>
            Please reload the page
          </Button>
        </div>
      </div>
    </div>
    );
  }
}

export default MessageComponentOtherStates;
