import {useSession} from 'next-auth/react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {type FC} from 'react'
import {api} from '../../utils/api'

export const Sidebar: FC = () => {
    const session = useSession()
    const router = useRouter()
    const {data} = api.user.users.useQuery()
    const createChat = api.chat.createChat.useMutation()
    const handleCreateChat = async (otherUserId: string) => {
        if (!session.data?.user.id) return // TODO handle error
        const chat = await createChat.mutateAsync({users: [session.data?.user.id, otherUserId]})
        await router.push(`/chat/${chat.id}`)
    }
    return (
        <>
            {data?.map(user => {
                const chat = !!user.chats.length && user.chats[0] || undefined
                if (chat !== undefined) return (
                    <Link href={`/chat/${chat.id}`} key={user.id}>
                        <div >
                            {user.name}
                            {JSON.stringify(user.chats)}
                        </div>
                    </Link>
                )
                return (
                    <div key={user.id} onClick={() => handleCreateChat(user.id)}>
                        {user.name}
                        {JSON.stringify(user.chats)}
                    </div>
                )
            })}
        </>
    )
}