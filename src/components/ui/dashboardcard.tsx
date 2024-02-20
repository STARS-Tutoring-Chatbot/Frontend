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

type DashboardCardProps = {
  title: string | null;
  description: string | null;
  model: string | null;
  created_at: string | null;
  conversation_id: string | null;
};

function DashboardCard({
  title,
  description,
  model,
  created_at,
  conversation_id,
}: DashboardCardProps) {
  const navigate = useNavigate();
  const onTrashClick = () => {
    // TODO: Implement delete conversation
  };

  const onGoToConversationClick = () => {
    navigate(`${conversation_id}`);
  };

  // modify the created_at to be more human readable
  const date = created_at ? new Date(created_at).toDateString() : null;

  return (
    <Card className="flex my-3">
      <div className="flex-1">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            <div className="flex items-center space-x-1">
              <CalendarIcon />
              <p className="px-1">Created {date}</p>
            </div>
            <div className="flex items-center space-x-1">
              <BrainIcon size={16} color="#6B7280" />
              <p className="text-sm text-muted-foreground">
                Using {model ?? "Generic Trained Model"}
              </p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{description}</p>
        </CardContent>
        <CardFooter />
      </div>
      <div className="flex-none flex items-center py-1 icon-container">
        <Button variant="ghost" onClick={onTrashClick}>
          <TrashIcon width={24} height={24} />
        </Button>
        <Button variant="ghost" onClick={onGoToConversationClick}>
          <ChevronRightIcon width={24} height={24} />
        </Button>
      </div>
    </Card>
  );
}

export default DashboardCard;
