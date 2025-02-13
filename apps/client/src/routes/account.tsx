import { fetchAccount, fetchAccountsAvailable } from '@lens-protocol/client/actions';
import { useEffect, useState } from 'react'
import { client } from '../utils/client';
import { evmAddress } from '@lens-protocol/client';
import {
  LoginWithDimo,
  useDimoAuthState,
} from "@dimo-network/login-with-dimo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import ProfileForm from '@/components/forms/profile-form';
import { loginAsAccountOwner } from '@/utils/auth/auth';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '@/contexts/AppContext';
import Profile from '@/components/profile/profile';
import { useCredentialStore } from '@/store/store';



export default function Account() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { loggedInAccount } = useAppContext()

  const { address: user_address, isConnected } = useAccount()

  const myadd = useCredentialStore(state => state.user_address)

  useEffect(() => {
    const loggedIn = localStorage.getItem('lens_account')
    if (loggedIn && !isLoggedIn) {
      setIsLoggedIn(true)
    }
  }, [isLoggedIn])


  const {
    isAuthenticated,
    // getValidJWT,
    // email,
    // walletAddress,
    // getEmail
  } = useDimoAuthState();

  const { isLoading: accountsIsLoading, data: accountsData, refetch: refetchAccounts } = useQuery({
    queryKey: ['getAccounts'],
    queryFn: getAccounts,
    enabled: isConnected
  })

  const { data: accountData } = useQuery({
    queryKey: ['getAccount'],
    queryFn: getAccount,
    enabled: isConnected
  })

  async function getAccounts() {
    const result = await fetchAccountsAvailable(client, {
      managedBy: evmAddress(user_address!),
      includeOwned: true,
    })
    return (result as any).value
  }

  async function getAccount() {
    const result = await fetchAccount(client, {
      address: evmAddress(user_address!),
    })

    if (result.isErr()) {
      return console.error(result.error);
    }

    const account = result.value
    return account

  }






  return (
    <div className=''>
      {console.log('myadd=> ', myadd)}
      <div className="w-full p-4 flex justify-center items-center bg-black">
        <LoginWithDimo
          mode='popup'
          onSuccess={e => console.log('success=> ', e)}
          onError={e => console.log('err=> ', e)}
        />
      </div>

      {isAuthenticated ?
        <>
          <div className=''>

            <hr className='' />

            {!isLoggedIn &&
              <>
                <div className="w-full p-6 bg-slate-100 flex flex-col">
                  <div className="flex justify-between">
                    <p>Got no account yet?</p>
                    <Button onClick={() => setIsCreatingAccount(!isCreatingAccount)}>
                      {isCreatingAccount ? "Cancel" : "Create Account"}
                    </Button>
                  </div>
                  {isCreatingAccount ? <ProfileForm refetchAccounts={refetchAccounts} /> : null}
                </div>


                {!loggedInAccount &&
                  <div className="w-full p-6 bg-slate-200 flex flex-col max-h-[60vh] overflow-auto">
                    <h3 className="font-bold text-2xl mb-4 underline">Available Accounts</h3>
                    {accountsData?.items?.length ? (
                      <div className="">
                        {accountsData.items.map((item: any) => (
                          <div
                            key={item.account.address}
                            className="bg-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow max-w-[40rem]"
                          >
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                              Username: <span className="font-normal text-gray-700">{item.account.username.localName}</span>
                            </h3>
                            <p className="text-gray-800 font-medium">
                              Address: <span className="font-normal text-gray-600">{item.account.address}</span>
                            </p>
                            <p className="text-gray-800 font-medium">
                              Owner: <span className="font-normal text-gray-600">{item.account.owner}</span>
                            </p>
                            <p className="text-gray-800 font-medium">
                              Created At:{' '}
                              <span className="font-normal text-gray-600">
                                {new Date(item.account.createdAt).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })}
                              </span>
                            </p>

                            <button
                              onClick={() => loginAsAccountOwner(item.account.address, user_address!, () => setIsLoggedIn(true))}
                              className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                              Log in
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : accountsIsLoading ? (
                      <p className="text-gray-700 font-medium">Fetching accounts...</p>
                    ) : (
                      <p className="text-gray-700 font-medium">No accounts associated with this address</p>
                    )}
                  </div>
                }
              </>
            }

          </div>

          {/* {
            accountData && isLoggedIn ?
              <div className=''>
                <div className="bg-slate-400 w-full h-[6rem] flex justify-between items-end p-6">
                  <Avatar className='scale-150'>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <Button className='active:bg-blue-500'>Edit Profile</Button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    {loggedInAccount || <strong>username not set</strong>}
                  </h3>
                  <p>{accountData.address}</p>
                  <small className="text-xs leading-none">Joined {new Date(accountData.createdAt).toDateString()}</small>
                </div>

              </div>
              : null
          } */}

        </>
        : null}

        {isConnected?
        <Profile />
        : <p className='m-4 text-xl font-semibold'>Connect your wallet to continue</p>
        }
        {console.log('accdata->', accountsData)}

    </div>
  )
}
