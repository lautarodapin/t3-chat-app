import Link, {type LinkProps} from 'next/link'
import React from 'react'

export type ButtonLinkWrapperProps =
    | {type: 'button'; onClick: VoidFunction}
    | {type: 'link'; href: LinkProps['href']}

export const ButtonLinkWrapper: React.FC<React.PropsWithChildren<ButtonLinkWrapperProps>> = ({children, ...props}) => {
    if (props.type === 'link') {
        return <Link {...props}>{children}</Link>
    }
    return <div className='cursor-pointer' {...props}>{children}</div>

}
