"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { MeetingsFilter } from "./meetings-filter";
import { useState } from "react";
import { NewMeetingsDialog } from "./new-meetings-dialog";

export const MeetingsListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <NewMeetingsDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="px-4 py-4 lg:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">My Meetings</h5>
          <Button onClick={() => setIsDialogOpen((open) => !open)}>
            <PlusIcon />
            New Meeting
          </Button>
        </div>
        <div className="flex items-center gap-x-2">
          <MeetingsFilter />
          <Button size="sm" variant="outline">
            <XCircleIcon /> Clear
          </Button>
        </div>
      </div>
    </>
  );
};
