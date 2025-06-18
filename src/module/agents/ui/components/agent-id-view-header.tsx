import { BreadcrumbNavigation } from "./breadcrumb-navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
interface AgentIdViewHeaderProps {
  agentName: string;
  onEdit: () => void;
  onRemove: () => void;
}
export const AgentIdViewHeader = ({
  agentName,
  onEdit,
  onRemove,
}: AgentIdViewHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <BreadcrumbNavigation agentName={agentName} />
      {/* without modal false the dialog that this dropdown opens cause the webside to get unclickable */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom">
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
            <PencilIcon className="text-black size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onRemove} className="cursor-pointer">
            <TrashIcon className="text-black size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
