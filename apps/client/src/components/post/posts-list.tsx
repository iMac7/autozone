import { Button } from "@/components/ui/button"
import { PostForm } from "../forms/create-post"
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { getSession } from "@/utils/auth/auth";
import { storageClient } from "@/utils/storageclient";
import { textOnly } from "@lens-protocol/metadata";
import { z } from "zod";
import { evmAddress, postId, PostType, uri } from "@lens-protocol/client";
import { handleWith } from "@lens-protocol/client/viem";
import { walletClient } from "@/utils/viem";
import { post as _post, fetchPost, fetchPosts } from "@lens-protocol/client/actions";
import { client } from "@/utils/client";
import { useQuery } from "@tanstack/react-query";


interface PostsListProps {
    shouldPost: boolean;
    setShouldPost: (shouldPost: boolean) => void;
    postsData: any;
    refetchPosts: () => void;
    feed?: string;
}

export default function PostsList({ shouldPost, setShouldPost, postsData, refetchPosts, feed }: PostsListProps) {
    const [selectedPost, setSelectedPost] = useState<string | null>(null);

    console.log('postsData-->', postsData);
    

    return (
        <>
            <div className="relative p-2 w-full flex flex-col gap-3 items-center">
                {postsData?.items?.length ? (
                    postsData.items.map((post: any) => (
                        <Post post={post} key={post.id} selectedPost={selectedPost} setSelectedPost={setSelectedPost} />
                    ))
                ) : (
                    <p className="text-gray-700 font-medium">No posts available.</p>
                )}
            </div>

            {shouldPost && <PostForm closeForm={() => setShouldPost(false)} refetchPosts={refetchPosts} feed={feed} />}

            <Button
                onClick={() => setShouldPost(!shouldPost)}
                className='bg-white w-[4rem] h-[4rem] hover:bg-gray-200 fixed bottom-6 right-6'>
                <svg className='w-8 h-8' version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enableBackground="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="#231F20" d="M50.775,36.189L27.808,13.223c-1.366,0.954-3.259,1.444-5.659,1.444c-5.429,0-11.304-2.48-11.362-2.506 C10.534,12.054,10.267,12,10,12c-0.332,0-0.662,0.082-0.96,0.246c-0.538,0.295-0.912,0.82-1.013,1.425l-8,48 c-0.048,0.284-0.023,0.569,0.049,0.84l22.757-22.758C22.309,38.963,22,38.018,22,37c0-2.757,2.243-5,5-5s5,2.243,5,5s-2.243,5-5,5 c-1.018,0-1.962-0.309-2.753-0.833L1.49,63.926C1.656,63.969,1.826,64,2,64c0.109,0,0.219-0.009,0.329-0.027l48-8 c0.605-0.101,1.131-0.475,1.426-1.013c0.295-0.539,0.325-1.184,0.083-1.748C50.405,49.868,47.628,40.697,50.775,36.189z"></path> <rect x="25.358" y="21.379" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 54.935 67.7548)" fill="#231F20" width="32.284" height="2.243"></rect> <circle fill="#231F20" cx="27" cy="37" r="3"></circle> <path fill="#231F20" d="M63.414,20.586l-20-20C43.023,0.195,42.512,0,42,0s-1.023,0.195-1.414,0.586l-8.293,8.293l22.828,22.828 l8.293-8.293C64.195,22.633,64.195,21.367,63.414,20.586z"></path> </g> </g></svg>
            </Button>
        </>
    );
}

function Post({ post, selectedPost, setSelectedPost }: any) {

    return (
        <>
            <div
                className="bg-white shadow-lg px-6 py-2 hover:shadow-xl transition-shadow w-full rounded border-2 border-gray-200"
                onClick={() => setSelectedPost(post.id)}
            >
                <div className="flex justify-between">
                    <h4 className="font-semibold text-gray-500 mb-2">
                        {post.author.username.localName}
                    </h4>
                    <p className="font-thin text-sm">
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
                <div className="px-2">
                    <ul className="text-gray-600 mt-4 flex justify-around">
                        <li className="flex items-center">
                            <svg className="w-4 h-4" fill="#000000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M958 104h-62V43q0-17-12-29T855 2h-87q-17 0-29 12t-12 29v61h-62q-17 0-29 12t-12 29v4q-81-34-169-34-116 0-217 59-97 57-154 154-58 100-58 216.5T84 761q57 98 154 155 101 58 217.5 58T672 916q97-57 154-155 59-100 59-216 0-88-34-168h4q17 0 29-12t12-29v-62h62q17 0 29-12t12-29v-88q0-17-12-29t-29-12zM644 348q29 0 49.5 20.5t20.5 49-20.5 49T644 487t-49.5-20.5-20.5-49 20.5-49T644 348zm-377 0q29 0 49.5 20.5t20.5 49-20.5 49T267 487t-49.5-20.5-20.5-49 20.5-49T267 348zm473 255q-10 70-50.5 126.5t-102 88.5-132 32-132-32-102-88.5T171 603q-2-16 8.5-27.5T206 564h499q16 0 26.5 11.5T740 603zm218-370H855v103h-87V233H665v-88h103V43h87v102h103v88z"></path></g></svg>&nbsp;
                            {post.stats?.upvotes}
                        </li>
                        <li className="flex items-center">
                            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M16 1H0V13H5L8 16L11 13H16V1ZM3 6H5V8H3V6ZM9 6H7V8H9V6ZM13 6H11V8H13V6Z" fill="#000000"></path> </g></svg>
                            &nbsp;{post.stats?.comments}
                        </li>
                        <li className="flex items-center">
                            <svg className="w-4 h-4" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M19 7a1 1 0 0 0-1-1h-8v2h7v5h-3l3.969 5L22 13h-3V7zM5 17a1 1 0 0 0 1 1h8v-2H7v-5h3L6 6l-4 5h3v6z"></path></g></svg>
                            &nbsp;{post.stats?.reposts}
                        </li>
                        <li className="flex items-center">
                            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 10.4142L2.70711 14.7071L1.29289 13.2929L5 9.58579V9L1 9V2H7V10.4142Z" fill="#000000"></path> <path d="M9 9L13 9V9.58579L9.29289 13.2929L10.7071 14.7071L15 10.4142L15 2H9L9 9Z" fill="#000000"></path> </g></svg>
                            &nbsp; {post.stats?.quotes}
                        </li>
                    </ul>
                </div>


            </div>
            {selectedPost === post.id && <PostModal post={post} setSelectedPost={setSelectedPost} />}
        </>
    )
}

function PostModal({ post, setSelectedPost }: any) {
    const [comment, setComment] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isPosting, setIsPosting] = useState(false)

    const commentSchema = z.string().min(1, "Comment cannot be empty")

    async function addComment() {
        try {
            commentSchema.parse(comment)
            setError(null)

            setIsPosting(true)
            const metadata = textOnly({
                content: comment,
            })
            const { uri: _uri } = await storageClient.uploadAsJson(metadata)
            console.log('uri-->', _uri)

            // const _uri = 'lens://4e8192bf228abf1fbcb3530c18d1b5e7e79441e6d8b702df0031702f716c57f4'

            const sessionClient = await getSession()
            const result = await _post(sessionClient!, {
                contentUri: uri(_uri),
                commentOn: {
                    post: postId(post.id),
                },
                feed: evmAddress(post.feed),
            })
                .andThen(handleWith(walletClient))
                .andThen((sessionClient as any).waitForTransaction)
            setComment('')
            console.log('result-->', result)
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0].message)
                setTimeout(() => {
                    setError(null)
                }, 5000)
            }
        } finally {
            setIsPosting(false)
        }
    }

    const { data: comments, isLoading: commentsIsLoading, error: commentsError, refetch: refetchComments } = useQuery({
        queryKey: ['comments', post.id],
        queryFn: fetchComments,
    })

    async function fetchComments() {
        const result = await fetchPosts(client, {
            filter: {
                postTypes: [PostType.Comment],
                feeds: [{ feed: evmAddress(post.feed) }],
            },
        });

        if (result.isErr()) {
            return console.error(result.error);
        }
        console.log('comments-->', result.value)
        return result.value
    }

    async function fetch_post() {
        const result = await fetchPost(client, {
            post: postId(post.id),
        });

        if (result.isErr()) {
            return console.error(result.error);
        }
        // console.log('result-->', result.value)
        return result.value
    }

    return (
        <div
            className="bg-white top-[12rem] fixed w-full md:max-w-[48vw] shadow-lg h-[80vh] px-6 py-4 hover:shadow-xl transition-shadow w-full rounded border-2 border-gray-200"
        >
            <Button onClick={() => setSelectedPost(null)} className="absolute top-2 right-2">X</Button>
            <div className="flex justify-between">
                <h4 className="font-semibold text-gray-500">
                    {post.author.username.localName}
                </h4>
            </div>
            <h4 className="text-xl text-gray-800 my-2">
                {post.metadata?.content}
            </h4>
            <p className="font-thin text-sm">
                {new Date(post.timestamp).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </p>

            <div className="px-2">
                <ul className="text-gray-600 flex justify-between">
                    <li className="flex items-center">
                        <svg className="w-4 h-4" fill="#000000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M958 104h-62V43q0-17-12-29T855 2h-87q-17 0-29 12t-12 29v61h-62q-17 0-29 12t-12 29v4q-81-34-169-34-116 0-217 59-97 57-154 154-58 100-58 216.5T84 761q57 98 154 155 101 58 217.5 58T672 916q97-57 154-155 59-100 59-216 0-88-34-168h4q17 0 29-12t12-29v-62h62q17 0 29-12t12-29v-88q0-17-12-29t-29-12zM644 348q29 0 49.5 20.5t20.5 49-20.5 49T644 487t-49.5-20.5-20.5-49 20.5-49T644 348zm-377 0q29 0 49.5 20.5t20.5 49-20.5 49T267 487t-49.5-20.5-20.5-49 20.5-49T267 348zm473 255q-10 70-50.5 126.5t-102 88.5-132 32-132-32-102-88.5T171 603q-2-16 8.5-27.5T206 564h499q16 0 26.5 11.5T740 603zm218-370H855v103h-87V233H665v-88h103V43h87v102h103v88z"></path></g></svg>&nbsp;
                        {post.stats?.upvotes}
                    </li>
                    <li className="flex items-center">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M16 1H0V13H5L8 16L11 13H16V1ZM3 6H5V8H3V6ZM9 6H7V8H9V6ZM13 6H11V8H13V6Z" fill="#000000"></path> </g></svg>
                        &nbsp;{post.stats?.comments}
                    </li>
                    <li className="flex items-center">
                        <svg className="w-4 h-4" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M19 7a1 1 0 0 0-1-1h-8v2h7v5h-3l3.969 5L22 13h-3V7zM5 17a1 1 0 0 0 1 1h8v-2H7v-5h3L6 6l-4 5h3v6z"></path></g></svg>
                        &nbsp;{post.stats?.reposts}
                    </li>
                    <li className="flex items-center">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 10.4142L2.70711 14.7071L1.29289 13.2929L5 9.58579V9L1 9V2H7V10.4142Z" fill="#000000"></path> <path d="M9 9L13 9V9.58579L9.29289 13.2929L10.7071 14.7071L15 10.4142L15 2H9L9 9Z" fill="#000000"></path> </g></svg>
                        &nbsp; {post.stats?.quotes}
                    </li>
                </ul>
            </div>

            <hr className="mt-4 mb-2" />

            <Textarea
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex justify-between items-center">
                <p className="text-pink-400 text-sm">{error ? error : ''}</p>
                <Button className="mt-2 self-end" onClick={addComment}
                    disabled={isPosting}
                >
                    {isPosting ? 'Posting...' : 'Add Comment'}
                </Button>
            </div>

            <hr className="my-2" />

            <h3 className=" font-bold mb-4">Comments</h3>
            <div className="max-h-[40vh] overflow-y-auto">
                {commentsIsLoading ? (
                    <p className="text-gray-500">Loading comments...</p>
                ) : commentsError ? (
                    <p className="text-pink-500">Error loading comments. <Button onClick={fetchComments}>Retry</Button></p>
                ) : comments?.items?.length ? (
                    comments.items.map((comment: any) => (
                        <div 
                            key={comment.id} 
                            className="mb-4 p-3 bg-gray-50 rounded-lg"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-700">
                                    {comment.author.username.localName}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(comment.timestamp).toLocaleString('en-US', {
                                        month: 'short',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                            <p className="text-gray-800">{comment.metadata?.content}</p>
                            <div className="mt-2 flex justify-around gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M958 104h-62V43q0-17-12-29T855 2h-87q-17 0-29 12t-12 29v61h-62q-17 0-29 12t-12 29v4q-81-34-169-34-116 0-217 59-97 57-154 154-58 100-58 216.5T84 761q57 98 154 155 101 58 217.5 58T672 916q97-57 154-155 59-100 59-216 0-88-34-168h4q17 0 29-12t12-29v-62h62q17 0 29-12t12-29v-88q0-17-12-29t-29-12z"/>
                                    </svg>
                                    {comment.stats?.upvotes}
                                </span>


                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 7a1 1 0 0 0-1-1h-8v2h7v5h-3l3.969 5L22 13h-3V7zM5 17a1 1 0 0 0 1 1h8v-2H7v-5h3L6 6l-4 5h3v6z"/>
                                    </svg>
                                    {comment.stats?.reposts}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No comments yet</p>
                )}
            </div>
            <Button onClick={fetch_post}>Fetch Post</Button>

        </div>
    )
}