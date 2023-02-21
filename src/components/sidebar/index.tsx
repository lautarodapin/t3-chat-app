import {type FC} from 'react'
import {SidebarItem} from 'src/components/sidebar/sidebar-item'
import {api} from '../../utils/api'

export const Sidebar: FC = () => {
    const {data} = api.user.users.useQuery()
    return (
        <div>
            {data?.map(user => {
                return <SidebarItem key={user.id} user={user} />
            })}
        </div>
    )
}