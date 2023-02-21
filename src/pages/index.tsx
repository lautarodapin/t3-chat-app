import {type NextPage} from "next"

import {Sidebar} from '../components/sidebar'

const Home: NextPage = () => {
    return (
        <div className='flex flex-col'>
            <Sidebar />
        </div>
    )
}

export default Home
