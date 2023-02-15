import {TRPCError} from '@trpc/server'
import {z} from "zod"

import {createTRPCRouter, publicProcedure, protectedProcedure} from "../trpc"

export const chatRouter = createTRPCRouter({
    chat: protectedProcedure
        .input(z.string())
        .query(async ({ctx, input}) => {
            const chat = await ctx.prisma.chat.findFirst({
                where: {id: input},
                include: {users: true, message: true},
            })
            if (chat === null) throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Not found'
            })
            return chat
        }),
    createChat: protectedProcedure
        .input(z.object({
            users: z.array(z.string()).min(2).max(2),
        }))
        .mutation(async ({ctx, input}) => {
            const chat = await ctx.prisma.chat.create({
                data: {
                    users: {
                        connect: input.users.map(id => ({id})),
                    },
                },
            })
            return chat
        }),
    sendMessage: protectedProcedure
        .input(z.object({content: z.string(), chatId: z.string()}))
        .mutation(async ({ctx, input}) => {
            const message = await ctx.prisma.message.create({
                data: {
                    ...input,
                    createdById: ctx.session.user.id,

                },
                include: {createdBy: true, chat: {select: {id: true}}},
            })
            return message
        })
})
