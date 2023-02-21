import clsx from 'clsx'
import {User} from 'next-auth'
import React from 'react'
import tw from 'tw-tailwind'

type Props = {
    user: Pick<User, 'image' | 'email' | 'name'>
}

export const Avatar: React.FC<Props> = ({user}) => {
    const initials = user.name
        && user.name
            .split(' ')
            .flatMap(word => word.split('_'))
            .flatMap(word => word.split('-'))
            .map(word => word.substring(0, 1).toUpperCase()).join('')
        || user.email && user.email.substring(0, 1)
    return <>
        <div className={clsx("avatar", {'placeholder': !user.image || true})}>
            <div className={clsx('w-10 rounded-full', {
                'bg-neutral-focus text-neutral-content': !user.image
            })}>
                {user.image
                    && <img src={user.image} alt={initials || 'Avatar'} />
                    || <span className="text-3xl">{initials}</span>
                }
            </div>
        </div>
    </>
}