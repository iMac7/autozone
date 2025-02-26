import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchFeed, fetchPosts } from "@lens-protocol/client/actions";
import { evmAddress, PostType } from "@lens-protocol/client";
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
        queryFn: fetchposts,
        enabled: !!address,
    });

    async function fetchposts() {        
        if (!address) throw new Error('Address is required');

        const result = await fetchPosts(client, {
            filter: {
                feeds: [{ feed: evmAddress(address) }],
                postTypes: [PostType.Root, PostType.Repost, PostType.Quote]
            },
            cursor: null
        })

        console.log('valuee->', result);
        if (result.isErr()) {
            throw result.error;
        }

        return result.value;
    }

    const { data: feed, isLoading: feedIsLoading, error: feedError } = useQuery({
        queryKey: ['feed', address],
        queryFn: async () => {
            if (!address) throw new Error('Address is required');

            const result = await fetchFeed(client, {
                feed: evmAddress(address)
            })

            if (result.isErr()) {
                throw result.error;
            }

            return result.value;
        },
        enabled: !!address,
    });

    return (
        <>
            <header className=" bg-slate-200 sticky z-10 top-14 px-4 py-2 border-t-[1px] border-b-[1px] border-gray-500 flex gap-4 items-center">
                <Button onClick={() => navigate(-1)}>Back</Button>
                <div className="">
                    <h2 className="text-2xl font-bold">{feed?.metadata?.name}</h2>
                    <p className="text-sm">{!feedError && feedIsLoading ? 'loading ...' : feed?.metadata?.description}</p>
                </div>
            </header>
            <div className="relative h-full overflow-y-auto">

                {
                    postsIsLoading ? <p>Loading...</p> :
                        postsError ? <p>Error: {postsError.message}</p> :
                            !posts ? <p>No feed found</p> :
                                <PostsList shouldPost={shouldPost} setShouldPost={setShouldPost} postsData={posts} refetchPosts={refetchPosts} feed={address} />
                }
            </div>
        </>
    );
}