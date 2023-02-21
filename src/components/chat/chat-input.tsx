import {Chat} from '@prisma/client'
import clsx from 'clsx'
import React, {useEffect, useRef} from 'react'
import {api, RouterOutputs} from 'src/utils/api'

type Props = {
    chatId: Chat['id']
    onMessageCreated?: (data: RouterOutputs['chat']['sendMessage']) => void
}
export const ChatInput: React.FC<Props> = ({chatId, onMessageCreated}) => {
    const [input, setInput] = React.useState('')
    const {mutateAsync} = api.chat.sendMessage.useMutation({})
    return (
        <form
            className='flex space-x-2 w-full'
            onSubmit={async e => {
                e.preventDefault()
                if (!input || input.length < 3) return
                const newMsg = await mutateAsync({chatId, content: input})
                onMessageCreated?.(newMsg)
                setInput('')
            }}>
            <input
                className={clsx('input flex-1 input-primary')}
                value={input}
                placeholder='Escribi un mensaje...'
                onChange={e => setInput(e.target.value)}
            />
            <button
                className={clsx('btn btn-primary')}
                type='submit'>send</button>
        </form>
    )

}