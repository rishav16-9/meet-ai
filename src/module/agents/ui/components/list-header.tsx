"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { AgentDialog } from "./agent-dialog";

export const ListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <AgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="px-4 py-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xxl font-medium">My Agents</h5>
          <Button onClick={() => setIsDialogOpen((open) => !open)}>
            <PlusIcon /> New Agent
          </Button>
        </div>
      </div>
    </>
  );
};
