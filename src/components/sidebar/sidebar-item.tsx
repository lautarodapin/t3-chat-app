import clsx from 'clsx'
import {useSession} from 'next-auth/react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React from 'react'
import {Avatar} from 'src/components/avatars'
import {getRelativeTimeString} from 'src/utils'
import {api, type RouterOutputs} from 'src/utils/api'
import {ButtonLinkWrapperProps, ButtonLinkWrapper} from './button-link-wrapper'

type Props = {
    user: RouterOutputs['chat']['myChats'][number]['users'][number]
    chat: RouterOutputs['chat']['myChats'][number]
}
type LastMessage = RouterOutputs['chat']['myChats'][0]['message'][0] | undefined

export const SidebarItem: React.FC<Props> = ({user, chat}) => {
    const session = useSession()
    const router = useRouter()
    const utils = api.useContext()
    const [lastMessage, setLastMessage] = React.useState<LastMessage>(() => chat?.message[0])
    api.chat.onSendMessageToChat.useSubscription({
        chatId: chat?.id || '',
    }, {
        enabled: Boolean(chat?.id),
        onData: async (data) => {
            setLastMessage(data)
        }
    })
    return (
        <Link href={`/chat/${chat.id}`}>
            <div
                className={clsx('alert cursor-pointer flex-row justify-between gap-0')}
            >
                <div>
                    <Avatar user={user} />
                    <div>
                        <h3 className="font-bold">{user.name || user.email}</h3>
                        <div className="text-sm">{lastMessage?.content}</div>
                    </div>
                    <div className="text-xs text-right">
                        {getRelativeTimeString(lastMessage?.createdAt)}
                    </div>
                </div>
            </div>
        </Link>
    )
}
