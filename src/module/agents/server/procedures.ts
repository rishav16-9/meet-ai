import { z } from "zod";
import { db } from "@/db";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { agents, user } from "@/db/schema";
import { agentsInsertSchema, agentsUpdateSchema } from "../schemas";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [existingAgent] = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: sql<number>`5`,
        })
        .from(agents)
        .where(eq(agents.id, input.id));
      return existingAgent;
    }),

  getMany: protectedProcedure.query(async () => {
    const data = await db.select().from(agents);
    return data;
  }),

  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.auth.user;
      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input,
          userId,
        })
        .returning();
      return createdAgent;
    }),

  update: protectedProcedure
    .input(agentsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, instructions, id } = input;
      const { id: userId } = ctx.auth.user;

      const [userData] = await db
        .select()
        .from(user)
        .where(eq(user.id, userId));

      if (!userData) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      const [update] = await db
        .update(agents)
        .set({
          name,
          instructions,
        })
        .where(and(eq(agents.id, id), eq(agents.userId, userData.id)))
        .returning();

      return update;
    }),

  remove: protectedProcedure
    .input(agentsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.auth.session;
      const { id } = input;

      const [userData] = await db
        .select()
        .from(user)
        .where(eq(user.id, userId));

      if (!userData) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const [remove] = await db
        .delete(agents)
        .where(and(eq(agents.id, id), eq(agents.userId, userData.id)))
        .returning();

      return remove;
    }),
});
