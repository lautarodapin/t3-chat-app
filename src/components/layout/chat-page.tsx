import clsx from 'clsx'
import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import React from 'react'
import {Avatar} from 'src/components/avatars'
import {Loading} from 'src/components/loading'
import {Sidebar} from 'src/components/sidebar'
import {ButtonLinkWrapper, ButtonLinkWrapperProps} from 'src/components/sidebar/button-link-wrapper'
import {api} from 'src/utils/api'


type Props = {
    loading?: boolean
}

export const ChatPage: React.FC<React.PropsWithChildren<Props>> = ({children, loading}) => {
    const [drawerOpen, setDrawerOpen] = React.useState(false)
    const {data: contacts, isLoading: isContactsLoading} = api.user.contacts.useQuery(undefined, {
        enabled: drawerOpen,
    })
    const utils = api.useContext()
    const session = useSession()
    const router = useRouter()
    const createChat = api.chat.createChat.useMutation({
        // TODO add update last message
        onSettled: () => utils.user.users.invalidate(),
    })
    const handleCreateChat = async (otherUserId: string) => {
        if (!session.data?.user.id) return // TODO handle error
        const chat = await createChat.mutateAsync({users: [session.data?.user.id, otherUserId]})
        await router.push(`/chat/${chat.id}`)
    }
    return (
        <div className="drawer">
            <input checked={drawerOpen} onChange={e => setDrawerOpen(e.target.checked)} id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <div
                    className={clsx(`h-screen max-h-screen flex space-x-2`)}
                >
                    <div className={clsx(`min-w-[20rem] max-w-[20rem] flex flex-col py-2 px-2`)}>
                        <div className='grow'>
                            <Sidebar />
                        </div>
                        <label htmlFor="my-drawer" className="btn self-end btn-primary w-full drawer-button">
                            Contactos
                        </label>
                    </div>
                    <div className='border border-gray-800'></div>
                    <div className={clsx(`w-full`)}>
                        {loading
                            && <div
                                className={clsx(`flex items-center justify-center h-full`)}
                            >
                                <Loading />
                            </div>
                            || children
                        }
                    </div>
                </div>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 bg-base-100 text-base-content">
                    {isContactsLoading && <li><Loading /></li>}
                    {contacts?.map(contact => {
                        const chat = contact.chats[0]
                        const wrapperProps =
                            (chat !== undefined ? {
                                type: 'link',
                                href: `/chat/${chat.id}`,
                            } : {
                                type: 'button',
                                onClick: () => handleCreateChat(contact.id)
                            }) satisfies ButtonLinkWrapperProps
                        return (
                            <ButtonLinkWrapper key={contact.id} {...wrapperProps}>
                                <li onClick={() => setDrawerOpen(false)}>
                                    <div
                                        className={clsx('alert cursor-pointer flex-row justify-between gap-0')}
                                    >
                                        <div>
                                            <Avatar user={contact} />
                                            <div>
                                                <h3 className="font-bold">{contact.name || contact.email}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ButtonLinkWrapper>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}