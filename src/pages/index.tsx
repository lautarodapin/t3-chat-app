import {type NextPage} from "next"
import Head from "next/head"
import Link from "next/link"
import {signIn, signOut, useSession} from "next-auth/react"

import {api} from "../utils/api"
import {useRouter} from 'next/router'

import {Sidebar} from '../components/sidebar'

const Home: NextPage = () => {
    return (
        <>

            <Sidebar />
        </>
    )
}

export default Home
