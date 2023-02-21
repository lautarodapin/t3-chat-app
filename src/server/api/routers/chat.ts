import type {Message, User} from '@prisma/client'
import {TRPCError} from '@trpc/server'
import {observable} from '@trpc/server/observable'
import {EventEmitter} from 'events'
import {type Session} from 'next-auth'
import {z} from "zod"

import {createTRPCRouter, publicProcedure, protectedProcedure} from "../trpc"
type Length<T extends any[]> = T['length']
type MyEventsBase<T> = {
    [K in keyof T]: T[K] extends (...arg: infer Args) => unknown
    ? Length<Args> extends 1 ? T[K] : never
    : never
}
type MyEvents = MyEventsBase<{
    sendMessage: (data: Message & {chat: {id: string}, createdBy: User}) => void
    isTypingUpdate: (input: {user: Pick<Session['user'], 'id' | 'email' | 'name'>, chatId: string}) => void
}>

type inferEventParameters<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => unknown ? Parameters<T[K]>[0] : never
}
type EventParams = inferEventParameters<MyEvents>

declare interface MyEventEmitter {
    on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this
    off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this
    once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this
    emit<TEv extends keyof MyEvents>(
        event: TEv,
        ...args: Parameters<MyEvents[TEv]>
    ): boolean
}

class MyEventEmitter extends EventEmitter {}

// In a real app, you'd probably use Redis or something
const ee = new MyEventEmitter()

// type ChatId = string
// type UserId = string
// const chatsTyping = new Map<ChatId, Map<UserId, Date>>()
// const typingInterval = setInterval(() => {
//     const now = Date.now()
//     for (const [chatId, users] of chatsTyping) {
//         let updated = false
//         for (const [userId, time] of users) {
//             if (now - time.getTime() > 3e3) {
//                 users.delete(userId)
//                 updated = true
//             }
//         }
//     }
//     if (updated) {
//         for (const [chatId, users] of chatsTyping) {
//             let updated = false
//             for (const [userId, time] of users) {
//                 if (now - time.getTime() > 3e3) {
//                     users.delete(userId)
//                     updated = true
//                 }
//             }
//         }
//     }
// }, 1000)
// process.on('SIGTERM', () => clearInterval(typingInterval))

export const chatRouter = createTRPCRouter({
    userChats: protectedProcedure
        .query(async ({ctx}) => {
            const chats = await ctx.prisma.chat.findMany({
                where: {users: {some: {id: ctx.session.user.id}}},
                include: {
                    users: true,
                    message: {
                        orderBy: {createdAt: 'desc'},
                        take: 1,
                    },

                },
            })
            return chats.map(chat => ({...chat, lastMessage: chat.message[0]}))
        }),
    chat: protectedProcedure
        .input(z.object({chatId: z.string()}))
        .query(async ({ctx, input}) => {
            const chat = await ctx.prisma.chat.findFirst({
                where: {
                    id: input.chatId
                },
                include: {users: true, message: {include: {createdBy: true}}},
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
            ee.emit('sendMessage', message)
            return message
        }),
    onSendMessageToChat: protectedProcedure
        .input(z.object({chatId: z.string()}))
        .subscription(({input}) => {
            return observable<EventParams['sendMessage']>((emit) => {
                const onSendMessage = (data: EventParams['sendMessage']) =>
                    data.chatId === input.chatId
                    && emit.next(data)
                ee.on('sendMessage', onSendMessage)
                return () => {
                    ee.off('sendMessage', onSendMessage)
                }
            })
        }),
    isTyping: protectedProcedure
        .input(z.object({chatId: z.string()}))
        .mutation(async ({input, ctx}) => {
            const {id, email, name} = ctx.session.user
            ee.emit('isTypingUpdate', {...input, user: ctx.session.user})
        }),
    onIsTypingUpdated: protectedProcedure
        .input(z.object({chatId: z.string()}))
        .subscription(({input}) => {
            return observable<EventParams['isTypingUpdate']>((emit) => {
                const onIsTypingUpdated = (data: EventParams['isTypingUpdate']) => {
                    if (input.chatId !== data.chatId) return
                    return emit.next(data)
                }
                ee.on('isTypingUpdate', onIsTypingUpdated)
                return () => {
                    ee.off('isTypingUpdate', onIsTypingUpdated)
                }
            })
        }),
})
