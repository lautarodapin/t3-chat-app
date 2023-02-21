import type {Session} from 'next-auth'
import React from 'react'
import {api, type RouterOutputs} from 'src/utils/api'

type Props = {
    chat: RouterOutputs['chat']['chat']
}
type User = NonNullable<Session['user']>
export const ChatIsTyping: React.FC<Props> = ({chat}) => {
    const [typers, setTypers] = React.useState<User[]>([])
    api.chat.onIsTypingUpdated.useSubscription({chatId: chat.id}, {
        onData(data) {
            console.log('is typing', {data})
            setTypers(prev => {
                const index = prev.findIndex(({id}) => id === data.user.id)
                if (index === -1) {
                    return [...prev, data.user]
                }
                return prev.splice(index, 1)
            })
        },
    })

    return (
        <div>
            Typers: {[...typers].map(user => <div key={user.id}>{user.email || user.name}</div>)}
        </div>
    )

}