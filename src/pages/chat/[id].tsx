import {GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, InferGetServerSidePropsType} from 'next'
import {useRouter} from 'next/router'
import {ChatPage} from 'src/components/layout/chat-page'
import {ChatContainer} from '../../components/chat/chat-container'
import {appRouter} from '../../server/api/root'
import {getServerAuthSession} from '../../server/auth'
import {prisma} from '../../server/db'
import {api} from '../../utils/api'

// export const getServerSideProps = (async (ctx) => {
//     const session = await getServerAuthSession(ctx)
//     if (session === null) {
//         return ({redirect: '/api/auth/login'})
//     }
//     if (!ctx.params?.id || typeof ctx.params.id !== 'string') {
//         return {redirect: '/404'}
//     }
//     const chat = await appRouter.createCaller({prisma, session}).chat.chat(ctx.params.id)
//     return {props: {chat}}
// }) satisfies GetServerSideProps
export const getServerSideProps = (ctx: GetServerSidePropsContext): GetServerSidePropsResult<object> => {
    if (!ctx.params?.id || typeof ctx.params.id !== 'string') {
        return {
            redirect: {
                statusCode: 301,
                destination: '/404',
            },
        }
    }
    return {props: {}}
}
// type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Page() {
    const router = useRouter()
    const id = router.query.id as string || undefined
    const {data: chat, isLoading} = api.chat.chat.useQuery({
        chatId: id ?? '',
    }, {
        enabled: Boolean(id),
        onError: () => {
            void router.push('/')
        },
    })
    if (isLoading) return null
    if (!chat) {
        void router.push('/')
        return 'Redirecting...'
    }

    return (
        <ChatPage loading={isLoading}>
            <ChatContainer chatId={chat.id} />
        </ChatPage>
    )
}