/**
 * This is the client-side entrypoint for your tRPC API.
 * It is used to create the `api` object which contains the Next.js
 * App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types
 */
import {httpBatchLink, loggerLink} from "@trpc/client"
import {createTRPCNext} from "@trpc/next"
import {type inferRouterInputs, type inferRouterOutputs} from "@trpc/server"
import superjson from "superjson"
import {wsLink, createWSClient} from '@trpc/client/links/wsLink'

import {type AppRouter} from "../server/api/root"
import type {NextPageContext} from 'next'

const getBaseUrl = () => {
    if (typeof window !== "undefined") return "" // browser should use relative url
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
    return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}
const getWsBaseUrl = () => {
    return `ws://localhost:${process.env.NEXT_PUBLIC_WS_PORT}` // dev SSR should use localhost
}

function getEndingLink(ctx: NextPageContext | undefined) {
    if (typeof window === 'undefined') {
        return httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
            headers() {
                if (ctx?.req) {
                    return {...ctx.req.headers, 'x-ssr': '1'}
                }
                return {}
            },
        })
    }
    const wsClient = createWSClient({url: getWsBaseUrl()})
    return wsLink<AppRouter>({client: wsClient})
}

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
    config({ctx}) {
        return {
            /**
             * Transformer used for data de-serialization from the server.
             *
             * @see https://trpc.io/docs/data-transformers
             **/
            transformer: superjson,

            /**
             * Links used to determine request flow from client to server.
             *
             * @see https://trpc.io/docs/links
             * */
            links: [
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === "development" ||
                        (opts.direction === "down" && opts.result instanceof Error),
                }),
                // httpBatchLink({
                //     url: `${getBaseUrl()}/api/trpc`,
                // }),
                getEndingLink(ctx),
            ],
        }
    },
    /**
     * Whether tRPC should await queries when server rendering pages.
     *
     * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
     */
    // ssr: false,
    ssr: true,
})

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>
