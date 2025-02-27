import { useCredentialStore } from "@/store/store"
import { client } from "@/utils/client"
import { evmAddress } from "@lens-protocol/client"
import { fetchPosts } from "@lens-protocol/client/actions"
import { useQuery } from "@tanstack/react-query"
import PostsList from "../post/posts-list"
import { useState } from "react"

export default function Posts() {
    const lens_account = useCredentialStore(state => state.lens_address)

    const [shouldPost, setShouldPost] = useState(false)

    const { isLoading: postsIsLoading, error: postsError, data: postsData, refetch: refetchPosts } = useQuery({
        queryKey: ['getPosts'],
        queryFn: getPosts,
        enabled: !!lens_account
      })
    
      async function getPosts() {
        const result = await fetchPosts(client, {
          filter: {
            authors: [evmAddress(lens_account!)]
          }
        })
    
        if (result.isErr()) {
          return console.error(result.error)
        }
        return result.value
      }
    
    return (
        <div className="min-h-[80vh] w-full flex justify-center bg-gray-200">
            {postsIsLoading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
            ) : postsError ? (
                <div className="text-red-500 text-center py-4">
                    <p>Error loading posts. Please try again later.</p>
                </div>
            ) : postsData?.items?.length ? (
                <PostsList 
                shouldPost={shouldPost}
                 setShouldPost={setShouldPost}
                  postsData={postsData}
                   refetchPosts={refetchPosts}
                   feed={undefined}
                   isProfile={true} />
            ) : (
                <div className="text-gray-500 text-center py-4">
                    <p>No posts available.</p>
                </div>
            )}

        </div>
    )
}