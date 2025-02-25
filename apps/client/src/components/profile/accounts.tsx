import { client } from '@/utils/client'
import { fetchAccountsAvailable } from '@lens-protocol/client/actions'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { loginAsAccountOwner } from '@/utils/auth/auth'
import { useCredentialStore } from '@/store/store'
import { CreateAccount } from '../forms/create-account'
import { useState } from 'react'

export default function Accounts() {
    const [createAccount, setCreateAccount] = useState(false)

    const { address: user_address, isConnected } = useAccount()

    const lens_address = useCredentialStore(state => state.lens_address)
    const updateLensAddress = useCredentialStore(state => state.updateLensAddress)

    const { isLoading: accountsIsLoading, data: accounts, refetch: refetchAccounts } = useQuery({
        queryKey: ['getAccounts', user_address],
        queryFn: getAccounts,
        enabled: isConnected
    })

    async function getAccounts() {
        const result = await fetchAccountsAvailable(client, {
            managedBy: user_address,
            includeOwned: true,
        })
        return (result as any).value
    }

    return (
        <div className="p-4 bg-white relative z-20 max-w-[20rem] md:max-w-full overflow-hidden">

            {!createAccount ?
            <>
            {accountsIsLoading ?
                <p className='text-xl font-semibold'>fetching accounts...</p>
                : accounts?.items.length ?
                    <h3 className='sm:ml-4 text-xl font-semibold'>Accounts owned by this wallet address</h3>
                    : null}

            {
                accountsIsLoading? null: accounts?.items.length ?
                <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
                    {accounts.items.map((account, i) =>
                        <div key={i} className='p-2 max-w-[30rem]'>
                            <Card className={`${lens_address && lens_address === account.account.address ? 'border-2 border-green-500' : ''}`}>
                                <CardHeader>
                                    <CardTitle>{account.account.metadata.name}</CardTitle>
                                    <CardTitle className='text-sm'>{account.account.username?.value?.replace('lens/', '@')}</CardTitle>
                                    <CardDescription>Created on {new Date(account.account.createdAt).toDateString()}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-xs'>Lens account address</p>
                                    <p className='text-sm w-[5rem]'>{account.account.address}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        disabled={lens_address === account.account.owner}
                                        onClick={() => loginAsAccountOwner(account.account.address, user_address!, () => updateLensAddress(account.account.address))}
                                    >{lens_address === account.account.owner ? 'Logged in' : 'Log in as account owner'}</Button>
                                </CardFooter>
                            </Card>

                        </div>
                    )}
                    </div>
                    : <div className="">
                        <p>No accounts associated with this address. Create one instead?</p>
                    </div>
            }

            <Button className='m-4'
                onClick={() => setCreateAccount(true)}
            >Create Account</Button>
            </>
            : <CreateAccount setCreateAccount={setCreateAccount} refetchAccounts={refetchAccounts} />}
        </div>
    )
}
