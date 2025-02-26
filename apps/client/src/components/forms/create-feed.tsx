import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { feed } from "@lens-protocol/metadata";
import { createFeed } from "@lens-protocol/client/actions";
import { handleWith } from "@lens-protocol/client/viem";
import { uri } from '@lens-protocol/client';

import { storageClient } from '@/utils/storageclient';
import { authAsBuilder, loginAsAccountOwner } from '@/utils/auth/auth';
import { walletClient } from '@/utils/viem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useCredentialStore } from "@/store/store";

const formSchema = z.object({
    name: z.string().min(1, "Feed name is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
});

interface CreateGroupFormProps {
    onSuccess?: () => void;
}

export function CreateFeedForm({ onSuccess }: CreateGroupFormProps) {

    const lens_address = useCredentialStore(state => state.lens_address)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            title: "",
            description: "",
        },
    });

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const metadata = feed({
                name: values.name,
                title: values.title,
                description: values.description,
            });

            const { uri: metadataUri } = await storageClient.uploadAsJson(metadata);

            // lens://37ccbd8d63688b8e87d646101a60e93d8060716674c755b671cbb68025c7e57a

            // const metadataUri = 'lens://37ccbd8d63688b8e87d646101a60e93d8060716674c755b671cbb68025c7e57a'
            // console.log('feed metadataUri->', metadataUri);

            // const sessionClient = await getSession()
            const sessionClient = await authAsBuilder(walletClient.account!.address)
            console.log('client->', sessionClient);
            
            const result = await createFeed(sessionClient!, {
                metadataUri: uri(metadataUri),
            })
                .andThen(handleWith(walletClient as any))
                .andThen(sessionClient!.waitForTransaction);

            if (result.isOk()) {
                console.log('create feed result->', result.value);
                form.reset();
                //authenticate as account owner again
                await loginAsAccountOwner(lens_address as `0x${string}`, walletClient.account!.address)
                onSuccess?.();
            } else {
                form.setError("root", {
                    message: result.error.message || 'Failed to create group'
                });
            }
        } catch (err) {
            form.setError("root", {
                message: err instanceof Error ? err.message : 'An error occurred'
            });
        }
    };

    return (
        <Form {...form}>

            <Button
                className="absolute top-2 right-2"
                variant="outline"
                onClick={onSuccess}
            >
                Back
            </Button>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 relative p-4  max-w-[30rem]">
                <h3 className="text-2xl font-bold">Create Feed</h3>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Feed Name</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={form.formState.isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Feed title</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="lens://..."
                                    disabled={form.formState.isSubmitting}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} disabled={form.formState.isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />



                {form.formState.errors.root && (
                    <div className="text-red-500 text-sm">
                        {form.formState.errors.root.message}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full"
                >
                    {form.formState.isSubmitting ? 'Creating Feed...' : 'Create Feed'}
                </Button>
            </form>
        </Form>
    );
}
