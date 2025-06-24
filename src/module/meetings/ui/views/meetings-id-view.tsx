"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MeetingsIdViewHeader } from "../components/meetings-id-view-header";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UseConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { UpdateMeetingsDialog } from "../components/update-meetings-dialog";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";
import { CompletedState } from "../components/completed-state";

interface MeetingsIdViewProps {
  meetingId: string;
}
export const MeetingsIdView = ({ meetingId }: MeetingsIdViewProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );
  const [RemoveConfirmation, confirmRemove] = UseConfirm(
    "Are you sure",
    "This operation would delete this meeting"
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const remove = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        router.push("/meetings");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleRemoveMeeting = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    await remove.mutateAsync({ id: data.id });
  };

  const isActive = data.status === "active";
  const isCancelled = data.status === "cancelled";
  const isCompleted = data.status === "completed";
  const isProcessing = data.status === "processing";
  const isUpcoming = data.status === "upcoming";
  return (
    <>
      <UpdateMeetingsDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialValue={data}
      />
      <RemoveConfirmation />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <MeetingsIdViewHeader
          meetingName={data.name}
          onEdit={() => setIsEditDialogOpen(true)}
          onRemove={handleRemoveMeeting}
        />
        {isCancelled && <CancelledState />}
        {isProcessing && <ProcessingState />}
        {isActive && <ActiveState meetingId={data.id} />}
        {isCompleted && <CompletedState data={data}/>}
        {isUpcoming && (
          <UpcomingState
            meetingId={data.id}
            onCancelMeeting={() => {}}
            isCancelling={false}
          />
        )}
      </div>
    </>
  );
};

export const MeetingsIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meeting"
      description="This may take few seconds"
    />
  );
};

export const MeetingsIdViewError = () => {
  return (
    <ErrorState
      title="Error Loading meeting"
      description="Something went wrong"
    />
  );
};
