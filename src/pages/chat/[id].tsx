import {GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType} from 'next'
import {useRouter} from 'next/router'
import {appRouter} from '../../server/api/root'
import {getServerAuthSession} from '../../server/auth'
import {prisma} from '../../server/db'
import {api} from '../../utils/api'

export const getServerSideProps = (async (ctx) => {
    const session = await getServerAuthSession(ctx)
    if (session === null) {
        return ({redirect: '/api/auth/login'})
    }
    if (!ctx.params?.id || typeof ctx.params.id !== 'string') {
        return {redirect: '/404'}
    }
    const chat = await appRouter.createCaller({prisma, session}).chat.chat(ctx.params.id)
    return {props: {chat}}
}) satisfies GetServerSideProps

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export default function ChatPage({chat}: Props) {

    return <>{JSON.stringify(chat)}</>
}