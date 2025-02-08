import { useCredentialStore } from "@/store/store";
import { client } from "@/utils/client";
import { evmAddress } from "@lens-protocol/client";
import { fetchAccount } from "@lens-protocol/client/actions";
import { useQuery } from "@tanstack/react-query";

export default function AccountProfile() {
    const lens_address = useCredentialStore(state => state.lens_address)

    const { data: accountData } = useQuery({
        queryKey: ['getAccount'],
        queryFn: getAccount,
        enabled: !!lens_address
    })

    async function getAccount() {
        const result = await fetchAccount(client, {
            address: evmAddress(lens_address!),
        })

        if (result.isErr()) {
            return console.error(result.error);
        }

        const account = result.value
        return account

    }

    if (!accountData) {
        return <div className="p-4">Loading profile...</div>
    }

    return (
        <div className="w-[40rem] mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        {accountData.metadata?.picture ? (
                            <img 
                                src={accountData.metadata.picture} 
                                alt={accountData.metadata.name} 
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-2xl text-gray-400">👤</span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{accountData.metadata.name}</h1>
                        <p className="text-gray-600">@{accountData.username.localName}</p>
                    </div>
                </div>

                {/* Bio */}
                {accountData.metadata.bio && (
                    <div className="border-t pt-4">
                        <h2 className="text-lg font-semibold mb-2">Bio</h2>
                        <p className="text-gray-700">{accountData.metadata.bio}</p>
                    </div>
                )}

                {/* Account Details */}
                <div className="border-t pt-4">
                    <h2 className="text-lg font-semibold mb-2">Account Details</h2>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p>
                            <span className="font-medium">Address:</span>{' '}
                            {`${accountData.address.slice(0, 6)}...${accountData.address.slice(-4)}`}
                        </p>
                        <p>
                            <span className="font-medium">Created:</span>{' '}
                            {new Date(accountData.createdAt).toLocaleDateString()}
                        </p>
                        <p>
                            <span className="font-medium">Username:</span>{' '}
                            {accountData.username.value}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}