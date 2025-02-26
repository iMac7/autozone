import { useParams } from "react-router"
import { useQuery } from '@tanstack/react-query'
import { fetchGroup } from '@lens-protocol/client/actions'
import { client } from "@/utils/client"


export default function Group() {
    const { id } = useParams()

    const { data: group, isLoading, error } = useQuery({
        queryKey: ['group', id],
        queryFn: async () => {
            const result = await fetchGroup(client, {
                group: id as string,
            })
            
            if (result.isErr()) {
                throw result.error
            }
            
            return result.value
        },
        enabled: !!id,
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading group</div>

    return (
        <div className="">
            <h1>{group?.metadata?.name || 'Unnamed Group'}</h1>
            <p>Address: {id}</p>
        </div>
    )
}