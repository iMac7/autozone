import { useCredentialStore } from "@/store/store"
import { Button } from "@/components/ui/button"
import { PostForm } from "../forms/create-post"

interface PostsListProps {
  shouldPost: boolean;
  setShouldPost: (shouldPost: boolean) => void;
  postsData: any;
  refetchPosts: () => void;
  feed?: string;
}

export default function PostsList({ shouldPost, setShouldPost, postsData, refetchPosts, feed }: PostsListProps) {

    return (
        <>
        <div className="w-full  bg-slate-100 flex flex-col items-center">
            {postsData?.items?.length ? (
                postsData.items.map((post: any) => (
                    <Post post={post} key={post.id} />
                ))
            ) : (
                <p className="text-gray-700 font-medium">No posts available.</p>
            )}
        </div>

        {shouldPost && <PostForm closeForm={()=> setShouldPost(false)} refetchPosts={refetchPosts} feed={feed} />}

        <Button 
      onClick={()=> setShouldPost(!shouldPost)}
      className='bg-white w-[4rem] h-[4rem] hover:bg-gray-200 fixed bottom-6 right-6'>
      <svg className='w-8 h-8' version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 64 64" enableBackground="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="#231F20" d="M50.775,36.189L27.808,13.223c-1.366,0.954-3.259,1.444-5.659,1.444c-5.429,0-11.304-2.48-11.362-2.506 C10.534,12.054,10.267,12,10,12c-0.332,0-0.662,0.082-0.96,0.246c-0.538,0.295-0.912,0.82-1.013,1.425l-8,48 c-0.048,0.284-0.023,0.569,0.049,0.84l22.757-22.758C22.309,38.963,22,38.018,22,37c0-2.757,2.243-5,5-5s5,2.243,5,5s-2.243,5-5,5 c-1.018,0-1.962-0.309-2.753-0.833L1.49,63.926C1.656,63.969,1.826,64,2,64c0.109,0,0.219-0.009,0.329-0.027l48-8 c0.605-0.101,1.131-0.475,1.426-1.013c0.295-0.539,0.325-1.184,0.083-1.748C50.405,49.868,47.628,40.697,50.775,36.189z"></path> <rect x="25.358" y="21.379" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 54.935 67.7548)" fill="#231F20" width="32.284" height="2.243"></rect> <circle fill="#231F20" cx="27" cy="37" r="3"></circle> <path fill="#231F20" d="M63.414,20.586l-20-20C43.023,0.195,42.512,0,42,0s-1.023,0.195-1.414,0.586l-8.293,8.293l22.828,22.828 l8.293-8.293C64.195,22.633,64.195,21.367,63.414,20.586z"></path> </g> </g></svg>
      </Button>
        </>
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
                {post.metadata?.content}
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
                        {post.stats?.upvotes}
                    </li>
                    <li className="flex items-center">
                        <svg className="w-6 h-6" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M16 1H0V13H5L8 16L11 13H16V1ZM3 6H5V8H3V6ZM9 6H7V8H9V6ZM13 6H11V8H13V6Z" fill="#000000"></path> </g></svg>
                        &nbsp;{post.stats?.comments}
                    </li>
                    <li className="flex items-center">
                        <svg className="w-6 h-6" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M19 7a1 1 0 0 0-1-1h-8v2h7v5h-3l3.969 5L22 13h-3V7zM5 17a1 1 0 0 0 1 1h8v-2H7v-5h3L6 6l-4 5h3v6z"></path></g></svg>
                        &nbsp;{post.stats?.reposts}
                    </li>
                    <li className="flex items-center">
                        <svg className="w-5 h-6" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 10.4142L2.70711 14.7071L1.29289 13.2929L5 9.58579V9L1 9V2H7V10.4142Z" fill="#000000"></path> <path d="M9 9L13 9V9.58579L9.29289 13.2929L10.7071 14.7071L15 10.4142L15 2H9L9 9Z" fill="#000000"></path> </g></svg>
                        &nbsp; {post.stats?.quotes}
                    </li>
                </ul>
            </div>

            <hr className="mt-6" />
        </div>
    )
}
