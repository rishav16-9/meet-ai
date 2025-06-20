import { DEFAULT_PAGE } from "@/constants";
import {
  parseAsString,
  parseAsInteger,
  useQueryStates,
  parseAsStringEnum,
} from "nuqs";
import { MeetingStatus } from "../types";

export const useMeetingsFilter = () => {
  return useQueryStates({
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE)
      .withOptions({ clearOnDefault: true }),
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    agentId: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),
    status: parseAsStringEnum(Object.values(MeetingStatus)),
  });
};
