import { z } from "zod";
import { db } from "@/db";
import { and, desc, eq, getTableColumns, ilike, sql, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { agents, user } from "@/db/schema";
import { agentsInsertSchema, agentsUpdateSchema } from "../schemas";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

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
