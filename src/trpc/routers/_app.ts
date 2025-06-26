import { createTRPCRouter } from "../init";
import { agentsRouter } from "@/module/agents/server/procedures";
import { premiumRouter } from "@/module/premium/server/procedures";
import { meetingsRouter } from "@/module/meetings/server/procedures";
export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  premium: premiumRouter,
  meetings: meetingsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
