import { z } from 'zod';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { getSession } from '@/utils/auth/auth';
import { textOnly } from '@lens-protocol/metadata';
import { storageClient } from '@/utils/storageclient';
import { post } from '@lens-protocol/client/actions';
import { uri } from '@lens-protocol/client';
import { handleWith } from '@lens-protocol/client/viem';
import { walletClient } from '@/utils/viem';



// const MetadataAttributeType = z.enum(['STRING', 'DATE', 'BOOLEAN', 'NUMBER', 'JSON']);


export const postSchema = z.object({
    content: z.string().min(1, 'Please post something :)'),
});

export type Post = z.infer<typeof postSchema>;

interface PostFormProps {
    closeForm: () => void;
    refetchPosts: () => void;
    feed?: string;
}

export function PostForm({ closeForm, refetchPosts, feed }: PostFormProps) {
    const [isPosting, setIsPosting] = useState(false)
    const [postError, setPostError] = useState<string | null>(null)

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(postSchema),
        defaultValues: {
            content: "",
        }
    });

    // const { address } = useAccount()

    const onSubmit = (data: any) => createPost(data)

    async function createPost(data: any) {
        try {
            setIsPosting(true)
            const metadata = textOnly(data)

            const { uri: _uri } = await storageClient.uploadAsJson(metadata)
            console.log("posted uri-> ", _uri);


            const sessionClient = await getSession()

            let result
            if (feed) {
                result = await post(sessionClient!, {
                    contentUri: uri(_uri),
                    feed: feed
                })
                    .andThen(handleWith(walletClient as any))
                    .andThen((sessionClient as any).waitForTransaction)
            } else {
                result = await post(sessionClient!, {
                    contentUri: uri(_uri),
                })
                    .andThen(handleWith(walletClient as any))
                    .andThen((sessionClient as any).waitForTransaction)
            }
            console.log('posted=>', result);
            if (result.isOk()) {
                console.log("Transaction indexed:", result.value)
                setValue("content", "")
                refetchPosts()
            } else {
                console.error("Transaction failed:", result.error)
            }

        } catch (error) {
            setPostError("Could not post. Please try again later.")
            setIsPosting(false)
            setTimeout(() => {
                setPostError(null)
            }, 5000)

        }
        finally {
            setIsPosting(false)

        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white space-y-4 p-6 pt-10 w-full max-w-[30rem] min-w-[10rem] border border-gray-500 fixed bottom-12 md:bottom-0 z-10">
            <Button className='absolute top-2 right-2 rounded-2xl' onClick={closeForm}>X</Button>

            <Controller
                name='content'
                control={control}
                render={({ field }) => <Input {...field} placeholder="how are you feeling today?" />}
            />
            {errors.content && <p className='text-sm text-pink-300'>{errors.content.message}</p>}
            {postError && <p className='text-sm text-pink-300'>{postError}</p>}
            <Button type="submit" disabled={isPosting}>Post</Button>
        </form>
    );
}