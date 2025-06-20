import { EmptyState } from "@/components/empty-state";

export const ProcessingState = () => {
  return (
    <div className="flex flex-col gap-y-8 bg-white px-4 py-5 rounded-lg items-center justify-center">
      <EmptyState
        image="/processing.svg"
        title="Meeting completed"
        description="This meeting was completed, a summary will appear soon"
      />
    </div>
  );
};
