"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { AgentDialog } from "./agent-dialog";
import { useAgentFilters } from "../../hooks/use-agents.filters";
import { AgentsSearchFilter } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constants";

export const ListHeader = () => {
  const [filters, setFilters] = useAgentFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isAnyFilterModified = !!filters.search;

  const onClearFilter = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
    });
  };
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
        <div className="flex items-center gap-x-2 p-1">
          <AgentsSearchFilter />
          {isAnyFilterModified && (
            <Button variant="outline" size="sm" onClick={onClearFilter}>
              <XCircleIcon />
              Clear
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
