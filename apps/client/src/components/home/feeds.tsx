import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateFeedForm } from "../forms/create-feed";
import { useQuery } from "@tanstack/react-query";
import { fetchAppFeeds, fetchFeed, fetchFeeds } from "@lens-protocol/client/actions";
import { evmAddress } from "@lens-protocol/client";
import { app_address } from "@/utils/env";
import { client } from "@/utils/client";
import { checkAuthStatus, loginAsAccountOwner } from "@/utils/auth/auth";
import { walletClient } from "@/utils/viem";
import { useCredentialStore } from "@/store/store";
import { useNavigate } from "react-router";


export default function Feeds() {
    const [showForm, setShowForm] = useState(false);
    const [singleFeed, setSingleFeed] = useState<any | null>(null);

    const lens_address = useCredentialStore(state => state.lens_address)

    const navigate = useNavigate()

    const { data: feeds, isLoading: feedsLoading, error: feedsError, refetch: refetchFeeds } = useQuery({
        queryKey: ['feeds'],
        queryFn: fetch_Feeds
    })

    //feed address to use below 0x83C8D9e96Da13aaD12E068F48C639C7671D2a5C7
    // const feedAddress = '0x83C8D9e96Da13aaD12E068F48C639C7671D2a5C7';
    // const feedAddress = '0xcd44d6fa0b8f4c5186b947f0df852de651a0443872abea6fcc06fb22f424bcd7';
    const feedAddress = '0xc32e852e4ae6d022ba1c6cb8b60978e9a387d13031883ef52c96a4316a9503cd'

    async function fetch_Feeds() {
        try {
            const result = await fetchFeeds(client, {
                filter: {
                  managedBy: {
                    address: evmAddress(walletClient.account!.address)
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
    };

    const handleFetchSingleFeed = async () => {
        try {
            // const result = await fetchFeed(client, {
            //     txHash: feedAddress
            // });

            const result = await fetchFeeds(client, {
                filter: {
                  managedBy: {
                    address: evmAddress(walletClient.account!.address)
                  }
                
                }});

            if (result.isErr()) {
                console.error(result.error);
                return;
            }

            // setSingleFeed(result.value);
            console.log('singleFeed result->', result);
        } catch (error) {
            console.error('Error fetching single feed:', error);
        }
    };

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
                    <div key={item.address} className="flex flex-col gap-2 p-4 border-2 rounded cursor-pointer hover:bg-gray-200 bg-white"
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
        


        {showForm ?
            <CreateFeedForm onSuccess={() => setShowForm(false)} />
            : <Button
                className="border-2 border-white absolute bottom-2 right-2 opacity-60 hover:opacity-100 transition-opacity duration-300"
                onClick={() => setShowForm(!showForm)}
            >
                <p>Create Feed</p>
            </Button>
        }
    </div>;
}