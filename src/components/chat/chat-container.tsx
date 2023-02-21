import {type Chat} from '@prisma/client'
import clsx from 'clsx'
import React from 'react'
import {ChatInput} from 'src/components/chat/chat-input'
import {ChatMessages} from 'src/components/chat/chat-messages'


type Props = {
    chatId: Chat['id']
}

export const ChatContainer: React.FC<React.PropsWithChildren<Props>> = ({chatId}) => {
    const bottomRef = React.useRef<HTMLDivElement>(null)
    const scrollToBottom = React.useCallback(() => {
        if (bottomRef.current == null) return
        console.log('scrolling bottom')
        bottomRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest',

        })
    }, [bottomRef])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => {scrollToBottom()}, [])

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
                <ChatMessages chatId={chatId} />
                <div id='bottom-chat' ref={bottomRef} />

            </div>
            <div
                className={clsx(`
                max-h-[4rem]
            `)}
            >
                <ChatInput chatId={chatId} onMessageCreated={scrollToBottom} />
            </div>
        </div>
    )
}