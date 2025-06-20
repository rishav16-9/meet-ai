import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import Link from "next/link";

interface ActiveStateProps {
  meetingId: string;
}
export const ActiveState = ({ meetingId }: ActiveStateProps) => {
  return (
    <div className="flex flex-col gap-y-8 bg-white px-4 py-5 rounded-lg items-center justify-center">
      <EmptyState
        image="/upcoming.svg"
        title="Meeting is active"
        description="Meeting will end once participants have left"
      />
      <div className="flex flex-col-reverse lg:flex-row items-center lg:justify-center gap-2 w-full">
        <Button asChild className="w-full lg:w-auto">
          <Link href={`/call${meetingId}`}>
            <VideoIcon />
            Join meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
