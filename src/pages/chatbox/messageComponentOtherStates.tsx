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
    return <div>LOADING</div>;
  }
  // error state
  else if (isError) {
    if (errorMessage === "") {
      errorMessage = "Something went wrong.";
    }
    return <div>ERROR</div>;
  }
}

export default MessageComponentOtherStates;
