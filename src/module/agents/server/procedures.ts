import { z } from "zod";
import { db } from "@/db";
import { and, desc, eq, getTableColumns, ilike, sql, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { agents } from "@/db/schema";
import {
  agentDeleteSchema,
  agentsInsertSchema,
  agentsUpdateSchema,
} from "../schemas";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingAgent] = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: sql<number>`5`,
        })
        .from(agents)
        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id))
        );
      if (!existingAgent) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agents not found" });
      }
      return existingAgent;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const data = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: sql<number>`5`,
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined
          )
        )
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({
          count: count(),
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);
      return {
        items: data,
        total: total.count,
        totalPages,
      };
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
      const { id: userId } = ctx.auth.user;

      const [updateAgent] = await db
        .update(agents)
        .set({
          ...input,
        })
        .where(and(eq(agents.id, input.id), eq(agents.userId, userId)))
        .returning();
      if (!updateAgent) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }
      return updateAgent;
    }),

  remove: protectedProcedure
    .input(agentDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.auth.user;
      const { id } = input;

      const [removeAgent] = await db
        .delete(agents)
        .where(and(eq(agents.id, id), eq(agents.userId, userId)))
        .returning();
      if (!removeAgent) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }
      return removeAgent;
    }),
});
