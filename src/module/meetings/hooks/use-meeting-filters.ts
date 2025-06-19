import { DEFAULT_PAGE } from "@/constants";
import { parseAsString, parseAsInteger, useQueryStates } from "nuqs";

export const useMeetingsFilter = () => {
  return useQueryStates({
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE)
      .withOptions({ clearOnDefault: true }),
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  });
};
