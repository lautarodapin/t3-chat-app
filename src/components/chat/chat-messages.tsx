import clsx from 'clsx'
import React from 'react'
import {ChatMessage} from 'src/components/chat/chat-message'
import {Loading} from 'src/components/loading'
import {api, type RouterOutputs} from 'src/utils/api'

type Props = {
    chatId: string
}
type Message = RouterOutputs['chat']['inifiteMessages']['items'][number]

export const ChatMessages: React.FC<Props> = ({chatId}) => {
    const messageQuery = api.chat.inifiteMessages.useInfiniteQuery({
        chatId,
    }, {
        getPreviousPageParam: d => d.prevCursor,
        onSuccess: (data) => {
            const msgs = data.pages.flatMap(page => page.items)
            mergeMessages(msgs)
        }
    })
    const [messages, setMessages] = React.useState(() => {
        return messageQuery.data?.pages.flatMap(page => page.items) || []
    })
    const mergeMessages = React.useCallback((newMessages?: Message[]) => {
        setMessages(prev => {
            const map = new Map<Message['id'], Message>()
            prev?.forEach(p => map.set(p.id, p))
            newMessages?.forEach(p => map.set(p.id, p))
            return Array.from(map).map(([, value]) => value)
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        })
    }, [])
    const {
        hasPreviousPage,
        isFetchingPreviousPage,
        fetchPreviousPage,
        isInitialLoading,
    } = messageQuery
    api.chat.onSendMessageToChat.useSubscription({chatId}, {
        onData: async (data) => {
            mergeMessages([data])
        },
    })
    return <>
        <button id='top-chat' className={clsx(`btn ${!hasPreviousPage && 'hidden'}`)}
            onClick={() => fetchPreviousPage()}
            disabled={isFetchingPreviousPage || !hasPreviousPage}
        >
            {hasPreviousPage && 'Cargar mas'
                || isFetchingPreviousPage && <Loading />
            }
        </button>
        <div className="flex-1"></div>
        {messages.map(message => (
            <ChatMessage message={message} key={message.id} />
        ))}
    </>
}