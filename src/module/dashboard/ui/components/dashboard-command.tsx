import {
  CommandResponsiveDialog,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { GeneratedAvatar } from "@/components/generated-avatar";

interface DashboardCommandProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  //   setOpen: (open: boolean) => void;
}
export const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const meetings = useQuery(
    trpc.meetings.getMany.queryOptions({
      pageSize: 100,
      search,
    })
  );
  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search,
    })
  );
  return (
    <CommandResponsiveDialog
      shouldFilter={false}
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput
        placeholder="Find a meeting or agent..."
        value={search}
        onValueChange={(value) => setSearch(value)}
      />
      <CommandList>
        <CommandGroup heading="Meetings">
          <CommandEmpty>
            <span className="text-xs text-muted-foreground">
              No meetings found
            </span>
          </CommandEmpty>
          {meetings.data?.items.map((meeting) => (
            <CommandItem
              key={meeting.id}
              onSelect={() => router.push(`/meetings/${meeting.id}`)}
            >
              {meeting.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Agents">
          <CommandEmpty>
            <span className="text-xs text-muted-foreground">
              No agents found
            </span>
          </CommandEmpty>
          {agents.data?.items.map((agent) => (
            <CommandItem
              key={agent.id}
              onSelect={() => router.push(`/agents/${agent.id}`)}
            >
              {agent.name}
              <GeneratedAvatar
                seed={agent.name}
                variant="botttsNeutral"
                className="size-5"
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandResponsiveDialog>
  );
};
