import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChevronRightIcon,
  TrashIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";
import { BrainIcon } from "lucide-react";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "./skeleton";
import { useMutation } from "@tanstack/react-query";
import { getSupabaseClient } from "@/util/supabase";

type DashboardCardProps = {
  title: string | null;
  description: string | null;
  model: string | null;
  created_at: string | null;
  conversation_id: string | null;
  isLoading?: boolean;
};

const supabase = getSupabaseClient();
function DashboardCard({
  title,
  description,
  model,
  created_at,
  conversation_id,
  isLoading,
}: DashboardCardProps) {
  const navigate = useNavigate();
  const onTrashClick = () => {
    // TODO: Implement delete conversation
  };

  const updateRecents = useMutation({
    mutationKey: ["dashboard/mostrecent"],
    mutationFn: async () => {
      await supabase
        ?.from("conversations")
        // @ts-ignore
        .update({ last_viewed: new Date().toISOString() })
        // @ts-ignore
        .eq("id", conversation_id)
        .then((res) => {
          console.log(res);
        });
    },
  });

  const onGoToConversationClick = () => {
    updateRecents.mutate();
    navigate(`${conversation_id}`);
  };

  const date = created_at ? new Date(created_at).toDateString() : null;

  if (isLoading) {
    return (
      <Card className="flex my-3">
        <div className="flex-1">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-1/2" />
            </CardTitle>
            <CardDescription>
              <div className="flex items-center space-x-1 pb-2">
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex items-center space-x-1">
                <Skeleton className="h-4 w-full" />
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-[250px]" />
          </CardContent>
          <CardFooter />
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="flex my-3 hover:bg-accent hover:text-accent-foreground hover:cursor-pointer"
      onClick={onGoToConversationClick}
    >
      <div className="flex-1">
        <CardHeader>
          <CardTitle className="pb-0">{title ?? <Skeleton />}</CardTitle>
          <CardDescription className="pb-0">
            <div className="flex items-center space-x-1">
              <CalendarIcon />
              <div className="px-1 pb-0">Created {date}</div>
            </div>
            <div className="flex items-center space-x-1">
              <BrainIcon size={16} color="#6B7280" />
              <div className="text-sm text-muted-foreground pb-0">
                Using {model ?? "Generic Trained Model"}
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="pb-0">{description}</div>
        </CardContent>
        <CardFooter />
      </div>
      <div className="flex-none flex items-center icon-container ">
        <Button
          variant="ghost"
          onClick={onGoToConversationClick}
          className="h-full"
        >
          <ChevronRightIcon width={24} height={24} />
        </Button>
      </div>
    </Card>
  );
}

export default DashboardCard;
