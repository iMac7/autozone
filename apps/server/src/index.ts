import express from 'express';
import cors from 'cors';
import { DIMO } from '@dimo-network/data-sdk'
import { api_key, client_id, redirect_uri } from './utils/env';

const dimo = new DIMO('Production')

const app = express();
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ client: client_id || 'no client id' })
})

// const developer_jwt =
// {
//   headers: {
//     Authorization: 'Bearer #token'
//   }
// }

app.get('/stuff', async (req, res) => {
  const vehicleJwt = await getVehicleJwt()
  res.json({ "suceess": true, vehicleJwt })
})

app.get('/vehicles', async (req, res) => {
  const vehicles = await getAllVehicles()
  res.json({ vehicles })
})

app.get('/vehicle/:tokenId', async (req, res) => {
  const vehicle = await getVehicleByTokenId(Number(req.params.tokenId))
  res.json({ vehicle })
})

app.get('/leaderboard', async (req, res) => {
  const leaderboard = await getLeaderboard()
  res.json({ "suceess": true, leaderboard })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})



async function getDeveloperJwt() {
  const authHeader = await dimo.auth.getToken({
    client_id,
    domain: redirect_uri,
    private_key: api_key,
  })
  return authHeader
}

async function getVehicleJwt() {
  // const token = developer_jwt
  const developer_jwt = await getDeveloperJwt()
  const vehicleJwt = await dimo.tokenexchange.exchange({
    ...developer_jwt,
    privileges: [1, 3, 4],
    tokenId: 17
  })
  console.log('vehicleJwt', vehicleJwt);
  return vehicleJwt
}

async function getLeaderboard() {
  const leaderboard = null
  return leaderboard
}

async function getAllVehicles() {
  const query = `
  {
  vehicles(
    filterBy: { privileged: "${client_id}" },
    first: 100) {
    totalCount
    nodes {
      id
      tokenId
      
      definition {
        make
        model
        year 
      }

    },
  }
}`

  const vehicles = await dimo.identity.query({query})
  return vehicles
}

async function getVehicleByTokenId(tokenId: number) {
  const query = `
  {
  vehicle(tokenId: ${tokenId}) {
    tokenId
    id
    manufacturer {
      name
    }
    mintedAt
    name
    definition {
      make
      model
      year
    }
  }
}
  `

  const vehicle = await dimo.identity.query({query})
  return vehicle
}

