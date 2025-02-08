import { useCredentialStore } from "@/store/store"
import { client } from "@/utils/client"
import { evmAddress } from "@lens-protocol/client"
import { fetchPosts } from "@lens-protocol/client/actions"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"

export default function PostsList() {
    const lens_account = useCredentialStore(state => state.lens_address)

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

    if (postsIsLoading) return <p>fetching posts...</p>

    if (postsError)
        return <div className="">
            could not fetch posts. <Button onClick={() => refetchPosts}>Try again</Button>
        </div>


    return (
        <div className="w-full  bg-slate-100 flex flex-col items-center">
            {postsData?.items?.length ? (
                postsData.items.map((post: any) => (
                    <Post post={post} key={post.id} />
                ))
            ) : (
                <p className="text-gray-700 font-medium">No posts available.</p>
            )}
        </div>
    );
}

function Post({ post }: any) {

    return (
        <div
            className="bg-white shadow-lg p-6 hover:shadow-xl transition-shadow w-[30rem]"
        >
            <div className="flex justify-between">
                <h4 className="font-semibold text-gray-500 mb-2">
                    {post.author.username.localName}
                </h4>
                <p className="font-thin">
                    {new Date(post.timestamp).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            </div>
            <h4 className="text-xl text-gray-800 mb-2">
                {post.metadata.content}
            </h4>
            {/* <div className="my-4">
                <a
                    href={`#post/${post.slug}`}
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                    View Details
                </a>
            </div> */}
            {/* <div className="text-gray-600 mb-4">

                <p>
                    <span className="font-medium text-gray-800">Feed Address:</span>{' '}
                    <span className="text-blue-600">{post.feed.address}</span>
                </p>
            </div> */}
            <div className="bg-gray-50 p-2">
                <ul className="text-gray-600 space-y-1 mt-2 flex justify-between">
                    <li className="flex items-center">
                        <svg className="w-6 h-6" fill="#000000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M958 104h-62V43q0-17-12-29T855 2h-87q-17 0-29 12t-12 29v61h-62q-17 0-29 12t-12 29v4q-81-34-169-34-116 0-217 59-97 57-154 154-58 100-58 216.5T84 761q57 98 154 155 101 58 217.5 58T672 916q97-57 154-155 59-100 59-216 0-88-34-168h4q17 0 29-12t12-29v-62h62q17 0 29-12t12-29v-88q0-17-12-29t-29-12zM644 348q29 0 49.5 20.5t20.5 49-20.5 49T644 487t-49.5-20.5-20.5-49 20.5-49T644 348zm-377 0q29 0 49.5 20.5t20.5 49-20.5 49T267 487t-49.5-20.5-20.5-49 20.5-49T267 348zm473 255q-10 70-50.5 126.5t-102 88.5-132 32-132-32-102-88.5T171 603q-2-16 8.5-27.5T206 564h499q16 0 26.5 11.5T740 603zm218-370H855v103h-87V233H665v-88h103V43h87v102h103v88z"></path></g></svg>&nbsp;
                        {post.stats.reactions}
                    </li>
                    <li className="flex items-center">
                        <svg className="w-6 h-6" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M16 1H0V13H5L8 16L11 13H16V1ZM3 6H5V8H3V6ZM9 6H7V8H9V6ZM13 6H11V8H13V6Z" fill="#000000"></path> </g></svg>
                        &nbsp;{post.stats.comments}
                    </li>
                    <li className="flex items-center">
                        <svg className="w-6 h-6" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M19 7a1 1 0 0 0-1-1h-8v2h7v5h-3l3.969 5L22 13h-3V7zM5 17a1 1 0 0 0 1 1h8v-2H7v-5h3L6 6l-4 5h3v6z"></path></g></svg>
                        &nbsp;{post.stats.reposts}
                    </li>
                    <li className="flex items-center">
                        <svg className="w-5 h-6" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 10.4142L2.70711 14.7071L1.29289 13.2929L5 9.58579V9L1 9V2H7V10.4142Z" fill="#000000"></path> <path d="M9 9L13 9V9.58579L9.29289 13.2929L10.7071 14.7071L15 10.4142L15 2H9L9 9Z" fill="#000000"></path> </g></svg>
                        &nbsp; {post.stats.quotes}
                    </li>
                </ul>
            </div>

            <hr className="mt-6" />
        </div>
    )
}
