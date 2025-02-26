import { useQuery } from "@tanstack/react-query"

import { client } from "@/utils/client";
import { app_address } from "@/utils/env";
import { evmAddress } from "@lens-protocol/client";
import { fetchAccount, fetchAppUsers } from "@lens-protocol/client/actions";

export default function Users() {

    const { data: appUsers } = useQuery({
        queryKey: ['appUsers'],
        queryFn: getAppUsers
    })

    async function getAppUsers() {
        const result = await fetchAppUsers(client, {
            app: evmAddress(app_address),
        })

        if (result.isErr()) {
            return console.error(result.error);
        }

        console.log('appUsers', result.value)
        return result.value;
    }

    async function getUserProfile(address: string) {
        const result = await fetchAccount(client, {
            address: evmAddress(address),
          });
          
          if (result.isErr()) {
            return console.error(result.error);
          }
          
          const account = result.value;
          console.log('account', account)

          return account;
    }



    return (
        <div className="p-2 bg-white">
            <div className="flex flex-col gap-4">
                {appUsers?.items
                    .filter(user => user.account.metadata)
                    .map((user) => (
                        <div 
                            key={user.account.address}
                            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => getUserProfile(user.account.address)}
                        >
                            <div className="flex items-start space-x-4">
                                {user.account.metadata?.picture ? (
                                    <img 
                                        src={user.account.metadata.picture} 
                                        alt={user.account.metadata.name || 'User'} 
                                        className="w-12 h-12 rounded-full"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-gray-500 text-xl">
                                            {user.account.metadata?.name?.[0] || '?'}
                                        </span>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h2 className="font-semibold text-gray-800">
                                        {user.account.metadata?.name || 'Anonymous'}
                                    </h2>
                                    {user.account.username && (
                                        <p className="text-sm text-blue-600">
                                            @{user.account.username.localName}
                                        </p>
                                    )}
                                    {user.account.metadata?.bio && (
                                        <p className="text-sm text-gray-600 mt-2">
                                            {user.account.metadata.bio}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-2">
                                        Last active: {new Date(user.lastActiveOn).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            
                        </div>
                    ))}
            </div>
        </div>
    )
}