import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { account } from "@lens-protocol/metadata";
import { storageClient } from "@/utils/storageclient";
import { setAccountMetadata } from "@lens-protocol/client/actions";
import { handleWith } from "@lens-protocol/client/viem";
import { walletClient } from "@/utils/viem";
import ImageUpload from "./img-upload";
import { getSession } from "@/utils/auth/auth";
import { uri } from "@lens-protocol/client";

const accountFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    localName: z.string().min(1, "Local name is required"),
    bio: z.string().min(1, "Bio is required"),
    picture: z.string().optional(),
    coverPicture: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function UpdateProfile({ profile, setUpdateProfile }: { profile: any, setUpdateProfile: (state: boolean) => void }) {
    const [profilepicUrl, setProfilepicUrl] = useState<string | null>(null)
    const [bannerUrl, setBannerUrl] = useState<string | null>(null)

    const [step, setStep] = useState<"" | "uploading" | "success">("");
    const [error, setError] = useState<string | null>(null);

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: {
            name: profile.metadata?.name || "",
            bio: profile.metadata?.bio || "",
            picture: "",
            coverPicture: "",
        },
    });

    const onSubmit = async (data: AccountFormValues) => {
        
        try {
            const metadata = account({
                name: data.name,
                bio: data.bio,
                picture: profilepicUrl || profile.metadata?.picture,
                coverPicture: bannerUrl || profile.metadata?.coverPicture
            })

            setStep("uploading");
            const { uri: _uri } = await storageClient.uploadAsJson(metadata)

            const sessionClient = await getSession()

            const result = await setAccountMetadata(sessionClient!, {
                metadataUri: uri(_uri),
            }).andThen(handleWith(walletClient as any));

            if (result.isErr()) {
                throw new Error(result.error.message);
            }

            setStep("success");
            setTimeout(() => {
                setUpdateProfile(false)
            }, 1000);

        } catch (err:any) {
            setError(err.message!);
            setStep("");
        }
    };


    return (
        <div className="p-6 w-full max-w-screen overflow-y-auto border-2 border-gray-300 absolute inset-0 z-10 bg-white rounded-lg">

            <p className="text-2xl font-bold underline">Update Account</p>
            <p className="my-4 text-xs">Please refresh in case of errors updating account.</p>
            <Button
                className="absolute top-2 right-2"
                onClick={() => setUpdateProfile(false)}
            >
                X
            </Button>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <hr />
                    <p>Profile Picture. Upload to get a url.</p>
                    <input className="text-sm px-2 border-2 border-gray-300" type="text"
                        value={profilepicUrl || ''} onChange={() => { }} />
                    <ImageUpload uploadedUrl={profilepicUrl} setUploadedUrl={setProfilepicUrl} />
                    <hr />

                    <p>Cover Picture. Upload to get a url.</p>
                    <input className="text-sm px-2 border-2 border-gray-300" type="text"
                        value={bannerUrl || ''} onChange={() => { }} />
                    <ImageUpload uploadedUrl={bannerUrl} setUploadedUrl={setBannerUrl} />

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        onClick={()=> onSubmit(form.getValues())}
                        // disabled={step === "uploading"}
                    >
                        {step === "uploading" ? "Uploading..."
                            : step === "success" ? "Success"
                                : "Update Profile"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
