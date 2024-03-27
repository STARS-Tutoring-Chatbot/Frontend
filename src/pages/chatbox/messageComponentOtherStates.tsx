import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
    // create loading component
    return <div>MessageComponentOtherStates</div>;
  }
  // error state
  else if (isError || !isLoading) {
    if (errorMessage === "") {
      errorMessage = "Something went wrong.";
    }
    // create error component
    return <div>MessageComponentOtherStates</div>;
  }
}

export default MessageComponentOtherStates;
