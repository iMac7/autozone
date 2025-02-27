import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchFeeds } from "@lens-protocol/client/actions";
import { evmAddress } from "@lens-protocol/client";
import { signer_address } from "@/utils/env";
import { client } from "@/utils/client";
import { useNavigate } from "react-router";


export default function Feeds() {
    // const [showForm, setShowForm] = useState(false);

    const navigate = useNavigate()

    const { data: feeds, isLoading: feedsLoading, error: feedsError, refetch: refetchFeeds } = useQuery({
        queryKey: ['feeds'],
        queryFn: fetch_Feeds,
    })

    async function fetch_Feeds() {
        try {
            const result = await fetchFeeds(client, {
                filter: {
                  managedBy: {
                    address: evmAddress(signer_address)
                  }
                
                }});

            if (result.isErr()) {
                console.error(result.error);
                return;
            }
            console.log('_feeds result->', result);
            return result.value
        } catch (error) {
            console.error('Error fetching single feed:', error)
            throw error
        }
    }

    return <div className="h-full overflow-y-auto">
        {/* <Button onClick={fetch_Feeds}>Fetch Single Feed</Button>
        <Button onClick={checkAuthStatus}>Check Auth</Button>
        <Button onClick={() => loginAsAccountOwner(lens_address as `0x${string}`, walletClient.account!.address)}>Auth as owner</Button>
        <Button onClick={() => refetchFeeds()}>Refetch</Button> */}

        {/* {console.log('feeds->', feeds)
        } */}

        {feedsLoading && <p>Loading feeds...</p>}
        {feedsError && <p>Error loading feeds. <Button onClick={() => refetchFeeds()}>Retry</Button></p>}        

        {feeds && (
            <div className="flex flex-col gap-4">
                {feeds.items.map((item) => (
                    <div key={item.address} className="flex flex-col gap-2 p-4 border-2 rounded cursor-pointer hover:border-gray-500 bg-white"
                        onClick={() => navigate(`/feed/${item.address}`)}
                    >
                        <p className="font-bold">{item.metadata?.name}</p>
                        <p className="text-sm">{item.metadata?.title}</p>
                        <p className="">{item.metadata?.description}</p>
                        {/* {console.log('item->', item)} */}
                    </div>
                ))}
            </div>
        )}
        


        {/* {showForm ?
            <CreateFeedForm onSuccess={() => setShowForm(false)} />
            : <Button
                className="border-2 border-white absolute bottom-10 md:bottom-2 right-2 opacity-60 hover:opacity-100 transition-opacity duration-300"
                onClick={() => setShowForm(!showForm)}
            >
                Create Feed
            </Button>
        } */}
    </div>;
}