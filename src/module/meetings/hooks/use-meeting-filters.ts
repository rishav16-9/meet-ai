import { DEFAULT_PAGE_SIZE } from "@/constants";
import { parseAsString, parseAsInteger, useQueryStates } from "nuqs";

export const useMeetingsFilter = () => {
  return useQueryStates({
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE_SIZE)
      .withOptions({ clearOnDefault: true }),
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  });
};
