import {signIn, signOut, useSession} from 'next-auth/react'
import type {FC, PropsWithChildren} from 'react'


export const Layout: FC<PropsWithChildren> = ({children}) => {
    const session = useSession()
    if (session.status === 'loading') return <>Loading...</>
    if (session.status === 'unauthenticated') {
        void signIn()
        return <>Redirecting...</>
    }
    return <>
        {children}
        <button onClick={() => void signOut()}>Logout</button>
    </>
}