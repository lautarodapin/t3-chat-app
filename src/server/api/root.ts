import {createTRPCRouter, protectedProcedure, publicProcedure} from "./trpc"
import {exampleRouter} from "./routers/example"
import {userRouter} from './routers/user'
import {chatRouter} from './routers/chat'
import {observable} from '@trpc/server/observable'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
    example: exampleRouter,
    user: userRouter,
    chat: chatRouter,
    randomNumber: publicProcedure.subscription(() => {
        return observable<number>((emit) => {
            const int = setInterval(() => {
                emit.next(Math.random())
            }, 500)
            return () => {
                clearInterval(int)
            }
        })
    }),
    randomNumber2: protectedProcedure.subscription(() => {
        return observable<number>((emit) => {
            const int = setInterval(() => {
                emit.next(Math.random())
            }, 500)
            return () => {
                clearInterval(int)
            }
        })
    }),
})

// export type definition of API
export type AppRouter = typeof appRouter
