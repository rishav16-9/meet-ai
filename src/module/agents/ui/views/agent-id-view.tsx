"use client";
import { useState } from "react";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UseConfirm } from "@/hooks/use-confirm";
import { UpdateAgentDialog } from "../components/update-agent-dialog";

interface AgentIdViewProps {
  agentId: string;
}
export const AgentIdView = ({ agentId }: AgentIdViewProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({
      id: agentId,
    })
  );
  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );
        await queryClient.invalidateQueries(
          trpc.premium.getFreeUsage.queryOptions()
        );
        router.push("/agents");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const [RemoveConfirmation, confirmRemove] = UseConfirm(
    "Are you sure?",
    `The following action will remove ${data.meetingCount} associated meeting`
  );
  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    await removeAgent.mutateAsync({ id: agentId });
  };
  return (
    <>
      <UpdateAgentDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        initialValue={data}
      />
      <RemoveConfirmation />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <AgentIdViewHeader
          agentName={data.name}
          onEdit={() => setIsEditOpen((open) => !open)}
          onRemove={handleRemoveAgent}
        />
        <div className="bg-background rounded-lg">
          <div className="flex flex-col px-4 py-5 gap-y-5 col-span-5">
            <div className="flex gap-x-3 items-center">
              <GeneratedAvatar
                seed={data.name}
                variant="botttsNeutral"
                className="size-10"
              />
              <h2 className="font-medium text-2xl">{data.name}</h2>
            </div>
            <Badge
              variant="outline"
              className="flex items-center gap-x-2 [&>svg]:size-4"
            >
              <VideoIcon className="text-blue-700" />
              {data.meetingCount}{" "}
              {data.meetingCount === 1 ? "meeting" : "meetings"}
            </Badge>
            <div className="flex flex-col gap-y-4">
              <p className="font-medium text-lg">Instruction</p>
              <p className="text-neutral-800">{data.instructions}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const AgentIdViewSuspense = () => {
  return (
    <LoadingState
      title="Loading agent"
      description="This may take a few second ..."
    />
  );
};

export const AgentIdViewError = () => {
  return (
    <ErrorState
      title="Error loading agent"
      description="Something went wrong"
    />
  );
};
