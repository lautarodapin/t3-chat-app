import {useSession} from 'next-auth/react'
import {type FC} from 'react'
import {SidebarItem} from 'src/components/sidebar/sidebar-item'
import {api} from '../../utils/api'

export const Sidebar: FC = () => {
    const session = useSession()
    const {data} = api.chat.myChats.useQuery()

    return (
        <>
            {data?.map(chat => {
                const user = chat.users.find(user => user.id !== session.data?.user.id)
                if (!user) return null
                return <SidebarItem key={`${chat.id}-${user.id}`} chat={chat} user={user} />
            })}
        </>
    )
}