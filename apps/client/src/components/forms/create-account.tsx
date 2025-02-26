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
import { client } from "@/utils/client";
import { storageClient } from "@/utils/storageclient";
import { createAccountWithUsername } from "@lens-protocol/client/actions";
import { handleWith } from "@lens-protocol/client/viem";
import { walletClient } from "@/utils/viem";
import { app_address } from "@/utils/env";
import { signMessage } from "@wagmi/core";
import { config } from "@/contexts/WagmiContext";

const accountFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    localName: z.string().min(1, "Local name is required"),
    bio: z.string().min(1, "Bio is required"),
    picture: z.string().optional(),
    coverPicture: z.string().optional(),
    twitter: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function CreateAccount({ setCreateAccount, refetchAccounts }: { setCreateAccount: (value: boolean) => void, refetchAccounts: ()=> void }) {
    const [step, setStep] = useState<
        "metadata" | "uploading" | "deploying" | "success"
    >("metadata");
    const [error, setError] = useState<string | null>(null);

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: {
            name: "",
            localName: "",
            bio: "",
            picture: "",
            coverPicture: "",
            twitter: "",
        },
    });

    const onSubmit = async (data: AccountFormValues) => {                

        try {
            // Login as onboarding user
            const authenticated = await client.login({
                onboardingUser: {
                    app: app_address,
                    wallet: walletClient?.account!.address as string,
                },
                signMessage: (message) => signMessage(config, { message }),
            });

            if (authenticated.isErr()) {
                throw new Error(authenticated.error.message);
            }

            const sessionClient = authenticated.value;

            const metadata = account({
                name: data.name,
                bio: data.bio,
            })

            // // Store metadata in localStorage for recovery
            // localStorage.setItem("lens_account_metadata", JSON.stringify(metadata));

            const { uri } = await storageClient.uploadAsJson(metadata);
            localStorage.setItem("lens_account_uri", uri);

            // const uri = "lens://3623ccbb4d061f4454ecdd22c3dc2224f2bf67f0e0df84c198ee71762f3c2455"
            // const uri = 'lens://624084ae4d89c3172e9a2cd335194790b017842a8194e366e2b1bc3281ee4f45'

            // Step 3: Deploy account contract
            setStep("deploying");
            const result = await createAccountWithUsername(sessionClient, {
                username: { localName: data.localName },
                metadataUri: uri,
            }).andThen(handleWith(walletClient as any));

            if (result.isErr()) {
                throw new Error(result.error.message);
            }

            // Query account details and switch to account owner
            // const accountQuery =
            //     `
            //     query GetAccount($txHash: ${result.value.txHash}) {
            //         account(request: { txHash: $txHash }) {
            //         address
            //         }
            //     }
            //     `
            // // variables: { txHash: result.value.txHash },
            // const accountQueryResult = await sendGraphQLQuery(accountQuery)
            // console.log('accountQueryResult=>', accountQueryResult)

            // if (accountQueryResult.data.errors.length) {
            //     throw new Error(accountQueryResult.data.errors[0].message)
            // }

            // const accountAddress = accountQueryResult.data.account.address
            // await changeAuth(accountAddress)


            setStep("success");
            setTimeout(() => {
                setCreateAccount(false)
                refetchAccounts()
            }, 1000);

            // Clear localStorage after successful creation
            //   localStorage.removeItem("lens_account_metadata");
            //   localStorage.removeItem("lens_account_uri");

        } catch (err: any) {
            setError(err.message);
            setStep("metadata");
        }
    };


    return (
        <div className="w-full p-6 max-w-[30rem] border-2 border-gray-300 relative rounded-lg">

            <p className="text-2xl font-bold underline">Create Account</p>
            <p className="my-4 text-xs">Please refresh in case of errors creating account.</p>
            <Button
                className="absolute top-2 right-2"
                onClick={() => setCreateAccount(false)}
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
                        name="localName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Local name (can be same as username)</FormLabel>
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

                    {/* <FormField
                        control={form.control}
                        name="picture"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profile Picture URL</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="coverPicture"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cover Picture URL</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Twitter URL</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={step === "uploading" || step === "deploying" || step === "success"}
                    >
                        {step === "metadata" && "Create Account"}
                        {step === "uploading" && "Uploading Account Metadata..."}
                        {step === "deploying" && "Deploying Account Contract..."}
                        {step === "success" && "Authentication Success"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
