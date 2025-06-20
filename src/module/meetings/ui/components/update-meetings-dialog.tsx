import { MeetingsGetOne } from "../../types";
import { MeetingsForm } from "./meetings-form";
import { ResponsiveDialog } from "@/components/responsive-dialog";

interface UpdateMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue: MeetingsGetOne;
}

export const UpdateMeetingsDialog = ({
  open,
  onOpenChange,
  initialValue,
}: UpdateMeetingDialogProps) => {
  return (
    <ResponsiveDialog
      title="Edit Meeting"
      description="Edit your meeting"
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingsForm
        initialValues={initialValue}
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
