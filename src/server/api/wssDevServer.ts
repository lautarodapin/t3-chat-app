import {applyWSSHandler} from '@trpc/server/adapters/ws'
import fetch from 'node-fetch'
import ws from 'ws'
import {env} from '../../env.mjs'
import {appRouter} from './root'
import {createTRPCContext} from './trpc'


if (!global.fetch) {
    global.fetch = fetch
}
const wss = new ws.Server({
    port: Number(env.NEXT_PUBLIC_WS_PORT),
})

const handler = applyWSSHandler({wss, router: appRouter, createContext: createTRPCContext})

wss.on('connection', (ws) => {
    console.log(`➕➕ Connection (${wss.clients.size})`)
    ws.once('close', (code, reason) => {
        console.log(`➖➖ Connection (${wss.clients.size}) ${code} - ${reason.toString()}`)
    })
})
console.log(`✅ WebSocket Server listening on ws://localhost:${env.NEXT_PUBLIC_WS_PORT}`)

wss.on('error', (error) => console.error(error))
process.on('SIGTERM', () => {
    console.log('SIGTERM')
    handler.broadcastReconnectNotification()
    wss.close()
})
