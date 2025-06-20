import { Input } from "@/components/ui/input";
import { useMeetingsFilter } from "../../hooks/use-meeting-filters";
import { SearchIcon } from "lucide-react";

export const MeetingsSearchFilter = () => {
  const [filters, setFilters] = useMeetingsFilter();
  return (
    <div className="flex items-center gap-x-2">
      <div className="relative">
        <Input
          className="h-9 bg-white w-[200px] pl-7"
          placeholder="Filter by name"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
        />
        <SearchIcon className="size-4 absolute -translate-y-1/2 left-2 top-1/2" />
      </div>
    </div>
  );
};
