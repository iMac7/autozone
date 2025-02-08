import Accounts from './accounts'
import { Button } from '@/components/ui/button'
import { useCredentialStore } from '@/store/store'
import { useState } from 'react'
import { CreateAccount } from '../forms/create-account'
import AccountProfile from './account-profile'
import Posts from './posts'

export default function Profile() {
  const [selectedSection, setSelectedSection] = useState(0)

  const lens_address = useCredentialStore(state => state.lens_address)
  const sections = lens_address 
    ? [
        { name: 'Profile', component: <AccountProfile /> },
        { name: 'Posts', component: <Posts /> },
        { name: 'Accounts', component: <Accounts /> }
      ]
    : [
        { name: 'Accounts', component: <Accounts /> }
      ]


  return (
    <div className="">
      <header className='border-b-2 border-black bg-white flex p-2 max-w-full overflow-x-auto gap-10 justify-around sticky z-30 top-12'>
        {
          sections.map((section, i) =>
            <Button
              key={i}
              variant='ghost'
              onClick={() => setSelectedSection(i)}
            >{section.name}</Button>
          )
        }
      </header>
      <div className="flex justify-center">
      {
        sections[selectedSection].component
      }

      </div>

    </div>
  )
}
