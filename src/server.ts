import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { PrismaClient } from "@prisma/client";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";

const prisma = new PrismaClient();

const appRouter = router({
  userList: publicProcedure.query(async () => {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      throw error;
    }
  }),

  userById: publicProcedure.input(z.number()).query(async (opts) => {
    const { input } = opts;
    try {
      const user = await prisma.user.findFirst({ where: { id: input } });
      return user;
    } catch (error) {
      throw error;
    }
  }),

  createUser: publicProcedure
    .input(
      z.object({
        data: z.object({
          name: z.string().optional(),
          email: z.string().optional(),
        }),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      try {
        const newUser = await prisma.user.create({ data: input.data });
        return newUser;
      } catch (error) {
        console.error("Error creating user:", error);
        throw error;
      }
    }),

  updateUser: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          email: z.string(),
        }),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      try {
        const updateUser = await prisma.user.update({
          where: { id: input.id },
          data: input.data,
        });
        return updateUser;
      } catch (error) {
        throw error;
      }
    }),

  deleteUser: publicProcedure.input(z.number()).mutation(async (opts) => {
    const { input } = opts;
    try {
      await prisma.user.delete({ where: { id: input } });
      console.log("se borró bien");
    } catch (error) {
      throw error;
    }
  }),
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);
