import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchFeed, fetchPosts } from "@lens-protocol/client/actions";
import { evmAddress } from "@lens-protocol/client";
import { client } from "@/utils/client";
import PostsList from "@/components/post/posts-list";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Feed() {
    const { address } = useParams();

    const navigate = useNavigate();

    const [shouldPost, setShouldPost] = useState(false)

    const { data: posts, isLoading: postsIsLoading, error: postsError, refetch: refetchPosts } = useQuery({
        queryKey: ['feed_posts', address],
        queryFn: async () => {
            if (!address) throw new Error('Address is required');
            
            const result = await fetchPosts(client, {
                filter: {
                    feeds: [{feed: evmAddress(address)}]
                }
            })

            console.log('valuee->', result);
            if (result.isErr()) {
                throw result.error;
            }
            
            return result.value;
        },
        enabled: !!address,
    });

    const { data: feed, isLoading: feedIsLoading, error: feedError, refetch: refetchFeed } = useQuery({
        queryKey: ['feed', address],
        queryFn: async () => {
            if (!address) throw new Error('Address is required');
            
            const result = await fetchFeed(client, {
                feed: evmAddress(address)
            })

            console.log('valuee->', result);
            if (result.isErr()) {
                throw result.error;
            }
            
            return result.value;
        },
        enabled: !!address,
    });

    // if (postsIsLoading) return <div>Loading...</div>;
    // if (postsError) return <div>Error: {postsError.message}</div>;
    // if (!posts) return <div>No feed found</div>;

    return (
        <div className="relative border-2 border-red-500 h-full overflow-y-auto">
            {/* Replace with your feed display logic */}
            {/* <pre>{JSON.stringify(feed, null, 2)}</pre> */}
            {/* <p>feeds fetched</p> */}
            {console.log('feedd->', feed)
            }
            <header className="p-4 border-b-2 border-gray-500 flex gap-4 items-center">
                <Button onClick={() => navigate(-1)}>Back</Button>
                <div className="">
                    <h1 className="text-2xl font-bold">{feed?.metadata?.name}</h1>
                    <p className="text-sm">{feed?.metadata?.description}</p>
                </div>
            </header>
            {
                postsIsLoading? <p>Loading...</p> :
                postsError? <p>Error: {postsError.message}</p> :
                !posts? <p>No feed found</p> :
                <PostsList shouldPost={shouldPost} setShouldPost={setShouldPost} postsData={posts} refetchPosts={refetchPosts} feed={address} />
            }
        </div>
    );
}