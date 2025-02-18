import { fetchAppFeeds, fetchPosts } from '@lens-protocol/client/actions';
import { client } from '../utils/client';
import { evmAddress } from '@lens-protocol/client';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useCredentialStore } from '@/store/store';
import Feeds from '@/components/home/feeds';
import { useAccount } from 'wagmi';
import { app_address } from '@/utils/env';
import Users from '@/components/home/users';


export default function Home() {
  const [selectedSection, setSelectedSection] = useState(0)

  const { address: userAddress } = useAccount()

  const sections = [
    { name: 'Feeds', component: <Feeds /> },
    { name: 'Users', component: <Users /> },
    // { name: 'Timeline', component: <Timeline /> },
    // {name: 'Posts', component: <PostsList shouldPost={shouldPost} setShouldPost={setShouldPost} />},
    // { name: 'Groups', component: <Groups /> },
  ]

  const navigate = useNavigate()

  const lens_account = useCredentialStore(state => state.lens_address)

  useEffect(() => {
    if (!lens_account) {
      navigate('/account')
    }
  }, [])

  const { data: appFeeds, isLoading: appFeedsLoading, error: appFeedsError, refetch: refetchAppFeeds } = useQuery({
    queryKey: ['app_feeds'],
    queryFn: async () => {
      const result = await fetchAppFeeds(client, {
        app: evmAddress(app_address),
      });

      if (result.isErr()) {
        throw result.error;
      }
      console.log('feeds resultt->', result.value);

      return result.value;
    }
  })



  return (
    <div className='flex w-full gap-4'>
      <div className='flex flex-col gap-2 w-1/2'>

        <header className='p-2 flex justify-around border-b-2 border-black'>
          {sections.map((section, i) => (
            <Button key={i} variant='ghost' className={`font-semibold border-b-2 ${selectedSection === i ? 'border-black' : 'border-transparent'}`} onClick={() => setSelectedSection(i)}>{section.name}</Button>
          ))}
        </header>

        <div className="min-h-[85vh] border-2 border-gray-300 relative p-4 bg-white bg-cover bg-center bg-no-repeat">
        {!userAddress? <p className='text-pink-500'>Please connect wallet first</p>
          :sections[selectedSection].component}
        </div>

        {/* <Button 
      onClick={()=> setShouldPost(!shouldPost)}
      className='bg-white w-[4rem] h-[4rem] hover:bg-gray-200 fixed bottom-6 right-6'>
      <svg className='w-8 h-8' version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 64 64" enableBackground="new 0 0 64 64" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="#231F20" d="M50.775,36.189L27.808,13.223c-1.366,0.954-3.259,1.444-5.659,1.444c-5.429,0-11.304-2.48-11.362-2.506 C10.534,12.054,10.267,12,10,12c-0.332,0-0.662,0.082-0.96,0.246c-0.538,0.295-0.912,0.82-1.013,1.425l-8,48 c-0.048,0.284-0.023,0.569,0.049,0.84l22.757-22.758C22.309,38.963,22,38.018,22,37c0-2.757,2.243-5,5-5s5,2.243,5,5s-2.243,5-5,5 c-1.018,0-1.962-0.309-2.753-0.833L1.49,63.926C1.656,63.969,1.826,64,2,64c0.109,0,0.219-0.009,0.329-0.027l48-8 c0.605-0.101,1.131-0.475,1.426-1.013c0.295-0.539,0.325-1.184,0.083-1.748C50.405,49.868,47.628,40.697,50.775,36.189z"></path> <rect x="25.358" y="21.379" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 54.935 67.7548)" fill="#231F20" width="32.284" height="2.243"></rect> <circle fill="#231F20" cx="27" cy="37" r="3"></circle> <path fill="#231F20" d="M63.414,20.586l-20-20C43.023,0.195,42.512,0,42,0s-1.023,0.195-1.414,0.586l-8.293,8.293l22.828,22.828 l8.293-8.293C64.195,22.633,64.195,21.367,63.414,20.586z"></path> </g> </g></svg>
      </Button> */}

        {/* {shouldPost && <PostForm closeForm={()=> setShouldPost(false)} refetchPosts={refetchPosts}  />} */}
      </div>
      <div className="w-1/2 border-2 border-gray-300 p-6">
        <header className="p-4 border-b-2 border-gray-500 font-bold text-xl underline">Global feed</header>
        {appFeedsLoading && <p>Loading feeds...</p>}
        {appFeedsError && 
        <p>Error loading feeds. <Button onClick={() => refetchAppFeeds()}>Retry</Button>
        </p>}
        {appFeeds && (
          <div className="my-4">
            {appFeeds.items.map((item) => (
              <div key={item.feed} className="p-4 border-2 rounded max-w-[20rem] cursor-pointer hover:border-gray-500 bg-white"
                onClick={() => navigate(`/feed/${item.feed}`)}
              >
                <p className='font-bold'>{item.__typename}</p>
                <p className='text-sm'>Created {new Date(item.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        {/* //leaderboard */}
        <div className="my-4">
          <header className="p-4 border-b-2 border-gray-500 font-bold text-xl underline">Leaderboard</header>
          <div className="mt-4 p-4 border-2 rounded max-w-[20rem] cursor-pointer hover:border-gray-500 bg-white">
            <p>1. Ferrari 488</p>
            <p>2. Porsche 911</p>
            <p>3. Lamborghini Aventador</p>
          </div>
        </div>


      </div>
    </div>
  )
}


