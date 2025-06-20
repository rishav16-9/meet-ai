"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { MeetingsSearchFilter } from "./meetings-search-filter";
import { useState } from "react";
import { NewMeetingsDialog } from "./new-meetings-dialog";
import { useMeetingsFilter } from "../../hooks/use-meeting-filters";
import { DEFAULT_PAGE } from "@/constants";
import { StatusFilter } from "./status-filter";
import { AgentFilter } from "./agent-filter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const MeetingsListHeader = () => {
  const [filters, setFilters] = useMeetingsFilter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isAnyFilterModified =
    !!filters.search || !!filters.status || !!filters.agentId;
  const handleClear = () => {
    setFilters({
      page: DEFAULT_PAGE,
      search: "",
      agentId: "",
      status: null,
    });
  };
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
        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <MeetingsSearchFilter />
            <StatusFilter />
            <AgentFilter />
            {isAnyFilterModified && (
              <Button onClick={handleClear} size="sm" variant="outline">
                <XCircleIcon className="size-4" /> Clear
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};
