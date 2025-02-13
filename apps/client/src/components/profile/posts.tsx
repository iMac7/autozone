import { useCredentialStore } from "@/store/store"
import { client } from "@/utils/client"
import { evmAddress } from "@lens-protocol/client"
import { fetchPosts } from "@lens-protocol/client/actions"
import { useQuery } from "@tanstack/react-query"
import PostsList from "../post/posts-list"
import { Button } from "../ui/button"
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
        <div className="min-h-[80vh] bg-gray-200">
            {postsIsLoading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
            ) : postsError ? (
                <div className="text-red-500 text-center py-4">
                    <p>Error loading posts. Please try again later.</p>
                </div>
            ) : postsData?.items?.length ? (
                <PostsList shouldPost={shouldPost} setShouldPost={setShouldPost} postsData={postsData} refetchPosts={refetchPosts} />
            ) : (
                <div className="text-gray-500 text-center py-4">
                    <p>No posts available.</p>
                </div>
            )}

        <Button 
      onClick={()=> setShouldPost(!shouldPost)}
      className='bg-white w-[4rem] h-[4rem] hover:bg-gray-200 fixed bottom-6 right-6'>
      <svg className='w-8 h-8' version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 64 64" enableBackground="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="#231F20" d="M50.775,36.189L27.808,13.223c-1.366,0.954-3.259,1.444-5.659,1.444c-5.429,0-11.304-2.48-11.362-2.506 C10.534,12.054,10.267,12,10,12c-0.332,0-0.662,0.082-0.96,0.246c-0.538,0.295-0.912,0.82-1.013,1.425l-8,48 c-0.048,0.284-0.023,0.569,0.049,0.84l22.757-22.758C22.309,38.963,22,38.018,22,37c0-2.757,2.243-5,5-5s5,2.243,5,5s-2.243,5-5,5 c-1.018,0-1.962-0.309-2.753-0.833L1.49,63.926C1.656,63.969,1.826,64,2,64c0.109,0,0.219-0.009,0.329-0.027l48-8 c0.605-0.101,1.131-0.475,1.426-1.013c0.295-0.539,0.325-1.184,0.083-1.748C50.405,49.868,47.628,40.697,50.775,36.189z"></path> <rect x="25.358" y="21.379" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 54.935 67.7548)" fill="#231F20" width="32.284" height="2.243"></rect> <circle fill="#231F20" cx="27" cy="37" r="3"></circle> <path fill="#231F20" d="M63.414,20.586l-20-20C43.023,0.195,42.512,0,42,0s-1.023,0.195-1.414,0.586l-8.293,8.293l22.828,22.828 l8.293-8.293C64.195,22.633,64.195,21.367,63.414,20.586z"></path> </g> </g></svg>
      </Button>
        </div>
    )
}