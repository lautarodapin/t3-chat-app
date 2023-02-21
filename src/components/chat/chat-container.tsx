import {type Message} from '@prisma/client'
import {inferProcedureOutput} from '@trpc/server'
import clsx from 'clsx'
import React, {useState} from 'react'
import {ChatInput} from 'src/components/chat/chat-input'
import {ChatIsTyping} from 'src/components/chat/chat-is-typing'
import {ChatMessage} from 'src/components/chat/chat-message'
import {ChatMessages} from 'src/components/chat/chat-messages'
import {api, RouterOutputs} from '../../utils/api'


type Props = {
    chat: RouterOutputs['chat']['chat']
}

export const ChatContainer: React.FC<React.PropsWithChildren<Props>> = ({chat}) => {
    const chatId = chat.id
    return (
        <div
            className={clsx(`
                max-h-screen overflow-hidden
                px-2
                space-y-2
            `)}
        >
            <div
                className={clsx(`
                    flex flex-col space-y-2 
                    max-h-[calc(100vh_-_4rem)]
                    min-h-[calc(100vh_-_4rem)]
                    overflow-y-auto
                `)}
            >
                <ChatMessages messages={chat.message} chatId={chatId} />
            </div>
            {/* <ChatIsTyping chat={chat} /> */}
            <div
                className={clsx(`
                max-h-[4rem]
            `)}
            >
                <ChatInput chat={chat} />
            </div>
        </div>
    )
}