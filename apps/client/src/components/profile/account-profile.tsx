import { useCredentialStore } from "@/store/store";
import { client } from "@/utils/client";
import { evmAddress } from "@lens-protocol/client";
import { fetchAccount } from "@lens-protocol/client/actions";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { backend_url } from "@/utils/env";
import { UpdateProfile } from "../forms/update-profile";
import { useState } from "react";
import { ShareVehiclesWithDimo } from "@dimo-network/login-with-dimo";
import { Input } from "../ui/input";
import axios from "axios"
import { useAccount } from "wagmi";

export default function AccountProfile() {
    const [updateProfile, setUpdateProfile] = useState(false)
    const [tokenid, setTokenid] = useState<number | null>(null)
    const [isClaiming, setIsClaiming] = useState(false)

    const lens_address = useCredentialStore(state => state.lens_address)
    const {address: user_address} = useAccount()

    const { data: accountData } = useQuery({
        queryKey: ['getAccount', lens_address],
        queryFn: getAccount,
        enabled: !!lens_address,
        staleTime: Infinity
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

    async function claimVehicle() {
        try {
            const credentials = JSON.parse(localStorage.getItem("lens.testnet.credentials")!)
            const idToken = credentials.data.idToken
            const url = `${backend_url}/vehicle/register`
            setIsClaiming(true)
            const response = await axios.post(url, {
                address: lens_address,
                signer: user_address,
                token_id: tokenid
            }, {
                headers: {
                    Authorization: `Bearer ${idToken}`
                }
            })
            const data = response.data
            //TODO: better retry
            if(response.data.error === "ETIMEDOUT") {
                claimVehicle() 
            }
            setIsClaiming(false)
            console.log('data->', data)
            
            
        } catch (error) {
            console.error(error)
        }
    }

    if (!accountData) {
        return <div className="p-4">Loading profile...</div>
    }

    return (
        <div className="bg-white rounded-lg relative">
            {/* {console.log('accdata-->', accountData)} */}
            <div className="space-y-6 p-6">
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        {accountData.metadata?.picture ? (
                            <img
                                src={accountData.metadata.picture}
                                alt={accountData.metadata?.name || 'pic here'}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-2xl text-gray-400">👤</span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{accountData.metadata?.name}</h1>
                        <p className="text-gray-600">@{accountData.username?.localName}</p>
                    </div>
                </div>

                {/* Bio */}
                {accountData.metadata?.bio && (
                    <div className="border-t pt-4">
                        <h2 className="text-lg font-semibold mb-2">Bio</h2>
                        <p className="text-gray-700">{accountData.metadata?.bio}</p>
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
                            {/* {new Date(accountData.createdAt).toLocaleDateString()} */}
                            {new Date(accountData.createdAt).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                        <p>
                            <span className="font-medium">Username:</span>{' '}
                            {accountData.username?.value}
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() => setUpdateProfile(true)}
                >Update Profile</Button>
                {updateProfile && <UpdateProfile profile={accountData} setUpdateProfile={setUpdateProfile} />}

            </div>
            <hr className="my-2" />

            <h2 className="font-bold text-xl ml-4">MY VEHICLE</h2>
            <div className="w-full my-2 flex justify-center items-center bg-black p-2">
                <ShareVehiclesWithDimo
                    mode="popup"
                    permissionTemplateId="1,3,4,5,6"
                    onSuccess={() => console.log("shared successfully")}
                    onError={() => { console.log("could not share vehicle") }}
                />
            </div>
            <div className="flex flex-col gap-2 p-4">
                <Input type="number" name="" id=""
                    placeholder="Enter your shared vehicle's tokenId to claim it"
                    onChange={e => setTokenid(Number(e.target.value))} />
                <Button onClick={claimVehicle}
                    disabled={isClaiming || !tokenid}
                >Claim vehicle</Button>
            </div>
        </div>
    )
}