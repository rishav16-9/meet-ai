import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";
import { AgentsGetOne } from "../../types";

interface AgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue: AgentsGetOne;
}

export const UpdateAgentDialog = ({
  open,
  onOpenChange,
  initialValue,
}: AgentDialogProps) => {
  return (
    <ResponsiveDialog
      title="Edit Agent"
      description="Edit the agent detail"
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
        initialValue={initialValue}
        onSuceess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
