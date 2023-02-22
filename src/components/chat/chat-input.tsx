import {Chat} from '@prisma/client'
import clsx from 'clsx'
import React, {useEffect, useRef} from 'react'
import {api, RouterOutputs} from 'src/utils/api'

type Props = {
    chatId: Chat['id']
    onMessageCreated?: (data: RouterOutputs['chat']['sendMessage']) => void
}

type ReducerState = {
    input: string
    error: null | string
}
type ReducerAction = string

export const ChatInput: React.FC<Props> = ({chatId, onMessageCreated}) => {
    const [state, dispatch] = React.useReducer((state: ReducerState, newInput: ReducerAction) => {
        return {
            ...state,
            input: newInput,
            error: !newInput && 'Debes escribir algo'
                || newInput.length < 3 && 'Debe tener mas de 3 caracteres'
                || null,
        }
    }, {input: '', error: null})
    const [input, setInput] = React.useState('')
    const {mutateAsync} = api.chat.sendMessage.useMutation({})
    return (
        <form
            className='flex space-x-2 w-full'
            onSubmit={async e => {
                e.preventDefault()
                if (state.error !== null) return
                const newMsg = await mutateAsync({chatId, content: input})
                onMessageCreated?.(newMsg)
                setInput('')
            }}>
            <div className="form-control w-full">
                <input
                    className={clsx('input flex-1 input-primary', {'input-error': state.error !== null})}
                    value={state.input}
                    placeholder='Escribi un mensaje...'
                    onChange={e => dispatch(e.target.value)}
                />
            </div>

            <button
                className={clsx('btn btn-primary')}
                type='submit'>Enviar</button>
        </form>
    )

}