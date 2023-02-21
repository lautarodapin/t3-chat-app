import type {Message} from '@prisma/client'
import clsx from 'clsx'
import {useSession} from 'next-auth/react'
import React from 'react'
import {Avatar} from 'src/components/avatars'
import {getRelativeTimeString} from 'src/utils'
import {RouterOutputs} from 'src/utils/api'

type Props = {
    message: RouterOutputs['chat']['chat']['message'][number]
}
export const ChatMessage: React.FC<Props> = ({message}) => {
    return <>
        <div className={clsx('alert items-start')}>
            <div>
                <Avatar user={message.createdBy} />
                <div>
                    <h3 className="font-bold">{message.content}</h3>
                    <div className="text-xs"><SendTime date={message.createdAt} /></div>
                </div>
            </div>
        </div>
    </>
}

const SendTime: React.FC<{date: Date}> = ({date}) => {
    const [curr, setCurr] = React.useState(() => getRelativeTimeString(date))

    React.useEffect(() => {
        const timer = setInterval(() => setCurr(getRelativeTimeString(date)), 3e3 * 5)
        return () => {
            clearInterval(timer)
        }
    }, [date])
    return <>{curr}</>
}