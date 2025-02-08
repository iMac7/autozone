import { ConnectKitButton } from 'connectkit'
import { Button } from './ui/button'
import { disconnect } from '@wagmi/core'
import { config } from '@/contexts/WagmiContext'
import { initWalletClient } from '@/utils/viem'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { useCredentialStore } from '@/store/store'

export default function Navbar() {
  async function disconnectWallet() {
    await disconnect(config)
  }
  const updateUser = useCredentialStore(state => state.updateUserAddress)

  const { isConnected, address: user_address } = useAccount()


  useEffect(() => {
    updateUser(user_address)
    
    if(isConnected) {
      initWalletClient(user_address!)
    }

  }, [isConnected])
  

  return (
    <>
      <div className="fixed z-30 top-0 w-full bg-gray-200 flex p-2 gap-2 justify-start">
        <div className='flex gap-2'>
          <ConnectKitButton 
          // onClick={initWalletClient}
          />
          {/* {console.log('isconnecting->', isConnecting)
          } */}
          {isConnected &&
            <Button
              onClick={disconnectWallet}
            >
              <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fillRule="evenodd" clipRule="evenodd" d="M13.617 3.844a2.87 2.87 0 0 0-.451-.868l1.354-1.36L13.904 1l-1.36 1.354a2.877 2.877 0 0 0-.868-.452 3.073 3.073 0 0 0-2.14.075 3.03 3.03 0 0 0-.991.664L7 4.192l4.327 4.328 1.552-1.545c.287-.287.508-.618.663-.992a3.074 3.074 0 0 0 .075-2.14zm-.889 1.804a2.15 2.15 0 0 1-.471.705l-.93.93-3.09-3.09.93-.93a2.15 2.15 0 0 1 .704-.472 2.134 2.134 0 0 1 1.689.007c.264.114.494.271.69.472.2.195.358.426.472.69a2.134 2.134 0 0 1 .007 1.688zm-4.824 4.994l1.484-1.545-.616-.622-1.49 1.551-1.86-1.859 1.491-1.552L6.291 6 4.808 7.545l-.616-.615-1.551 1.545a3 3 0 0 0-.663.998 3.023 3.023 0 0 0-.233 1.169c0 .332.05.656.15.97.105.31.258.597.459.862L1 13.834l.615.615 1.36-1.353c.265.2.552.353.862.458.314.1.638.15.97.15.406 0 .796-.077 1.17-.232.378-.155.71-.376.998-.663l1.545-1.552-.616-.615zm-2.262 2.023a2.16 2.16 0 0 1-.834.164c-.301 0-.586-.057-.855-.17a2.278 2.278 0 0 1-.697-.466 2.28 2.28 0 0 1-.465-.697 2.167 2.167 0 0 1-.17-.854 2.16 2.16 0 0 1 .642-1.545l.93-.93 3.09 3.09-.93.93a2.22 2.22 0 0 1-.711.478z"></path></g></svg>
            </Button>
          }
        </div>
      </div>

    </>
  )
}

