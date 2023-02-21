import clsx from 'clsx'
import React, {useEffect, useRef} from 'react'
import {ChatMessage} from 'src/components/chat/chat-message'
import {api, type RouterOutputs} from 'src/utils/api'



type Props = {
    messages: RouterOutputs['chat']['chat']['message']
    chatId: string
}

export const ChatMessages: React.FC<Props> = ({messages, chatId}) => {
    const utils = api.useContext()
    const bottomRef = useRef<HTMLDivElement>(null)
    api.chat.onSendMessageToChat.useSubscription({chatId}, {
        onData: async (data) => {
            utils.chat.chat.setData({chatId}, chat => chat && ({
                ...chat,
                message: [...chat.message, data],
            }))
        },
    })
    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest',
        })
    }, [messages.length])
    return <>
        <div id='top-chat' className='flex-1' />
        {messages.map(message => (
            <ChatMessage message={message} key={message.id} />
        ))}
        <div id='bottom-chat' ref={bottomRef} />
    </>
}