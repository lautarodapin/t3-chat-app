import {z} from "zod"

import {createTRPCRouter, publicProcedure, protectedProcedure} from "../trpc"

export const userRouter = createTRPCRouter({
    user: protectedProcedure
        .input(z.object({id: z.string()}))
        .query(async ({ctx, input}) => {
            const user = await ctx.prisma.user.findFirst({
                where: {id: input.id},
            })
            return user

        }),
    users: protectedProcedure
        .query(async ({ctx}) => {
            const users = await ctx.prisma.user.findMany({
                where: {
                    id: {not: ctx.session.user.id},
                },
                include: {
                    chats: {
                        where: {users: {some: {id: ctx.session.user.id}}},
                        include: {
                            message: {
                                orderBy: {createdAt: 'desc'},
                                take: 1,
                            },
                        }
                    },
                },
            })
            return users.map(user => ({
                ...user,
                chats: user.chats.map(chat => ({
                    ...chat,
                }))
            }))
        }),
})
