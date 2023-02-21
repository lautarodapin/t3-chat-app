import clsx from 'clsx'
import React from 'react'
import {Loading} from 'src/components/loading'
import {Sidebar} from 'src/components/sidebar'


type Props = {
    loading?: boolean
}

export const ChatPage: React.FC<React.PropsWithChildren<Props>> = ({children, loading}) => {


    return (
        <div
            className={clsx(`
                h-screen max-h-screen flex
                space-x-2
            `)}
        >
            <div className={clsx(`
                    min-w-[20rem]
                    max-w-[20rem]
                `)}>
                <Sidebar />

            </div>
            <div className='border border-gray-800'></div>
            <div className={clsx(`
                    w-full
                `)}>
                {loading
                    && <div
                        className={clsx(`
                            flex items-center justify-center h-full
                    `)}>
                        <Loading />
                    </div>
                    || children
                }
            </div>
        </div>
    )
}