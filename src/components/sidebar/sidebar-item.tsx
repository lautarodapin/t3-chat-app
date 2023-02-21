import clsx from 'clsx'
import {useSession} from 'next-auth/react'
import Link, {type LinkProps} from 'next/link'
import {useRouter} from 'next/router'
import React from 'react'
import {Avatar} from 'src/components/avatars'
import {getRelativeTimeString} from 'src/utils'
import {api, type RouterOutputs} from 'src/utils/api'

type Props = {
    user: RouterOutputs['user']['users'][number]
}
type LastMessage = Props['user']['chats'][0]['message'][0] | undefined

export const SidebarItem: React.FC<Props> = ({user}) => {
    const session = useSession()
    const router = useRouter()
    const utils = api.useContext()
    const chat = !!user.chats.length && user.chats[0] || undefined
    const [lastMessage, setLastMessage] = React.useState<LastMessage>(() => chat?.message[0])
    const createChat = api.chat.createChat.useMutation({
        // TODO add update last message
        onSettled: () => utils.user.users.invalidate(),
    })
    const handleCreateChat = async (otherUserId: string) => {
        if (!session.data?.user.id) return // TODO handle error
        const chat = await createChat.mutateAsync({users: [session.data?.user.id, otherUserId]})
        await router.push(`/chat/${chat.id}`)
    }
    api.chat.onSendMessageToChat.useSubscription({
        chatId: chat?.id || '',
    }, {
        enabled: Boolean(chat?.id),
        onData: async (data) => {
            setLastMessage(data)
        }
    })
    const wrapperProps =
        (chat !== undefined ? {
            type: 'link',
            href: `/chat/${chat.id}`,
        } : {
            type: 'button',
            onClick: () => handleCreateChat(user.id)
        }) satisfies WrapperProps
    return (
        <Wrapper {...wrapperProps}>
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
        </Wrapper>
    )
}

type WrapperProps =
    | {type: 'button', onClick: VoidFunction}
    | {type: 'link', href: LinkProps['href']}
const Wrapper: React.FC<React.PropsWithChildren<WrapperProps>> = ({children, ...props}) => {
    if (props.type === 'link') {
        return <Link {...props}>{children}</Link>
    }
    return <div className='cursor-pointer' {...props}>{children}</div>

}