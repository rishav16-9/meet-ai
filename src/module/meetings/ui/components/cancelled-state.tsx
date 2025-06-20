import { EmptyState } from "@/components/empty-state";

export const CancelledState = () => {
  return (
    <div className="flex flex-col gap-y-8 bg-white px-4 py-5 rounded-lg items-center justify-center">
      <EmptyState
        image="/cancelled.svg"
        title="Meeting cancelled"
        description="This meeting was cancelled"
      />
    </div>
  );
};
