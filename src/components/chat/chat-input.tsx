import clsx from 'clsx'
import React, {useEffect, useRef} from 'react'
import {api, RouterOutputs} from 'src/utils/api'

type Props = {
    chat: RouterOutputs['chat']['chat']
}
export const ChatInput: React.FC<Props> = ({chat}) => {
    const [input, setInput] = React.useState('')
    const {mutateAsync} = api.chat.sendMessage.useMutation({})
    return (
        <form
            className='flex space-x-2 w-full'
            onSubmit={async e => {
                if (!input || input.length < 3) return
                e.preventDefault()
                await mutateAsync({chatId: chat.id, content: input})
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