import { client } from '@/utils/client';
import { app_address } from '@/utils/env';
import { evmAddress } from '@lens-protocol/client';
import { fetchAppFeeds } from '@lens-protocol/client/actions';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const vehicles = [
  { model: 'Toyota Corolla', averageSpeed: 60, topSpeed: 120 },
  { model: 'Honda Civic', averageSpeed: 62, topSpeed: 125 },
  { model: 'Ford Mustang', averageSpeed: 70, topSpeed: 155 },
  { model: 'Chevrolet Camaro', averageSpeed: 68, topSpeed: 165 },
  { model: 'Tesla Model 3', averageSpeed: 65, topSpeed: 140 },
  { model: 'BMW 3 Series', averageSpeed: 67, topSpeed: 155 },
  { model: 'Mercedes-Benz C-Class', averageSpeed: 66, topSpeed: 150 },
  { model: 'Audi A4', averageSpeed: 64, topSpeed: 149 },
  { model: 'Porsche 911', averageSpeed: 75, topSpeed: 182 },
  { model: 'Nissan GT-R', averageSpeed: 80, topSpeed: 195 }
]

export default function SideContent() {
  const navigate = useNavigate()

  const { data: appFeeds, isLoading: appFeedsLoading, error: appFeedsError, refetch: refetchAppFeeds } = useQuery({
    queryKey: ['app_feeds'],
    queryFn: async () => {
      const result = await fetchAppFeeds(client, {
        app: evmAddress(app_address),
      });

      if (result.isErr()) {
        throw result.error;
      }
      return result.value;
    }
  })


  return (
    <div className="w-2/3 p-6 fixed bg-slate-300 h-full">
      {appFeedsLoading && <p>Loading feeds...</p>}
      {appFeedsError &&
        <p>Error loading feeds. <Button onClick={() => refetchAppFeeds()}>Retry</Button>
        </p>}
      {appFeeds && (
        <div className="my-4">
          {appFeeds.items.map((item) => (
            <div key={item.feed} className="flex flex-col gap-4 p-4 border-2 rounded max-w-[20rem] cursor-pointer hover:border-gray-500 bg-white"
              onClick={() => navigate(`/feed/${item.feed}`)}
            >
              <p className='font-bold'>Global chat</p>
              <p className='text-sm'>Created {new Date(item.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      <Table className='bg-slate-100 max-w-[25rem] mt-10'>
        <TableCaption>Safety first !</TableCaption>
        <TableHeader className='bg-gray-300'>
          <TableRow className=''>
            <TableHead className='font-bold w-[30px]'>POS</TableHead>
            <TableHead className="font-bold w-[150px]">MODEL</TableHead>
            <TableHead className='font-bold w-[80px]'>AVG SPEED</TableHead>
            <TableHead className='font-bold'>TOP SPEED</TableHead>            
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle, i) =>
            <TableRow className={i%2==0?'bg-white':''}>
              <TableCell className="font-bold text-center w-[30px]">{i+1}</TableCell>
              <TableCell className="w-[150px]">{vehicle.model}</TableCell>
              <TableCell className="font-medium">{vehicle.averageSpeed}</TableCell>
              <TableCell className="">{vehicle.topSpeed}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>


    </div>

  )
}
