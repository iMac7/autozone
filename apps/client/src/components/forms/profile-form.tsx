import { z } from 'zod';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { createAccount, enable_Signless, loginAsAccountOwner } from '@/utils/auth/auth';
import { useAccount } from 'wagmi';



const MetadataAttributeType = z.enum(['STRING', 'DATE', 'BOOLEAN', 'NUMBER', 'JSON']);

const attributeSchema = z.object({
    key: z.string(),
    type: MetadataAttributeType,
    value: z.string() // This will need custom validation based on type
});

export const profileSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    bio: z.string().optional(),
    localName: z.string().min(1, 'Name is required'),
    picture: z.string().optional(),
    coverPicture: z.string().optional(),
    attributes: z.array(attributeSchema).optional()
});

export type Profile = z.infer<typeof profileSchema>;


const ProfileForm = ({ refetchAccounts }: any) => {
    const [isLoading, setIsLoading] = useState(false)
    const { address: user_address } = useAccount()

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "roadster420",
            bio: "always in my car on 4:20",
            picture: "",
            coverPicture: "",
            localName: '',
            attributes: [
                { key: "twitter", type: "STRING", value: "https://twitter.com/janedoexyz" },
                { key: "enabled", type: "BOOLEAN", value: "true" },
                { key: "height", type: "NUMBER", value: "1.65" },
                { key: "settings", type: "JSON", value: '{"theme": "dark"}' },
            ]
        }
    });

    const { address } = useAccount()




    const onSubmit = (data: any) => authenticate(data)

    async function authenticate(data: any) {
        setIsLoading(true)
        console.log('data=', data, address, data.localName);
        const metadata = {
            name: data.name,
            bio: data.bio
        }
        const result = await createAccount(address!, metadata, data.localName)
        console.log('createaccresult=>', result)
        const tx_hash = (result as { value: string }).value
        const account_address = await getCreatedAccount(tx_hash)

        await loginAsAccountOwner(account_address, user_address!, () => { })
        await enable_Signless()
        setIsLoading(false)
        refetchAccounts()
    }

    async function getCreatedAccount(hash: string) {
        const query = `
        query {
            account(request: { txHash: "${hash}" }) {
                address
            }
        }
        `

        const url = 'https://api.testnet.lens.dev/graphql'
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();
        const address = data.data.account.address
        return address
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6 w-1/2 min-w-[10rem]">
            <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Name" />}
            />
            {errors.name && <p>{errors.name.message}</p>}

            <Controller
                name="bio"
                control={control}
                render={({ field }) => <Textarea {...field} placeholder="Bio" />}
            />

            {/* <Controller
                name="picture"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Profile Picture URL" />}
            /> */}

            <Controller
                name="localName"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Local name" />}
            />

            {/* <Controller
                name="coverPicture"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Cover Picture URL" />}
            /> */}

            {/* Attributes */}
            {/* <Controller
                name="attributes"
                control={control}
                render={({ field }) =>
                    <>
                    <div className='p-2 flex gap-6 items-center'>

                        <Label htmlFor="Enabled">Enabled</Label>
                        <Switch
                            id="Enabled"
                            checked={field.value?.find(a => a.key === 'enabled')?.value === 'true'}
                            onCheckedChange={(checked) => {
                                const newAttributes = field.value || [];
                                const enabledIndex = newAttributes.findIndex(a => a.key === 'enabled');
                                if (enabledIndex === -1) {
                                    newAttributes.push({ key: 'enabled', type: 'BOOLEAN', value: checked ? 'true' : 'false' });
                                } else {
                                    newAttributes[enabledIndex].value = checked ? 'true' : 'false';
                                }
                                setValue('attributes', newAttributes);
                            }}
                        />
                    </div>

                    <div className='p-2 flex gap-6 items-center'>

                        <Label htmlFor="Dark-Theme">Theme</Label>
                        <Switch
                            id="Dark-Theme"
                            checked={JSON.parse(field.value?.find(a => a.key === 'settings')?.value || '{}').theme === 'dark'}
                            onCheckedChange={(checked) => {
                                const newAttributes = field.value || [];
                                const settingsIndex = newAttributes.findIndex(a => a.key === 'settings');
                                const currentSettings = JSON.parse(newAttributes[settingsIndex]?.value || '{}');
                                currentSettings.theme = checked ? 'dark' : 'light';
                                if (settingsIndex === -1) {
                                    newAttributes.push({ key: 'settings', type: 'JSON', value: JSON.stringify(currentSettings) });
                                } else {
                                    newAttributes[settingsIndex].value = JSON.stringify(currentSettings);
                                }
                                setValue('attributes', newAttributes);
                            }}
                        />
                    </div>
                    </>
                }
            /> */}

            <Button type="submit" disabled={isLoading}>Submit</Button>

        </form>
    );
};

export default ProfileForm;