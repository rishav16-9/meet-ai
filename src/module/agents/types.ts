import type { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type AgentsGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"];
