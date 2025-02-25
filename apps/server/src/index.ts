import express from 'express';
import cors from 'cors';
import { DIMO } from '@dimo-network/data-sdk'
import { client_id, jwks_uri } from './utils/env';
import { jwtVerify, createRemoteJWKSet } from "jose"
import { addUser, getAllVehicles, getLeaderboard, getTelemetryData, getVehicleByTokenId, getVehicleJwt } from './utils/queries';

// const {jwtVerify, createRemoteJWKSet} = await import("jose")

export const dimo = new DIMO('Production')

const app = express();
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ client: client_id || 'no client id' })
})

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
  res.json({ "success": true, leaderboard })
})

app.get('/telemetry', async (req, res) => {
  const data = await getTelemetryData(1)
  res.json({ data })
})

app.post('/vehicle/register', async (req, res) => {
  const body = req.body
  console.log('body-', body);
  const id_token = req.headers.authorization?.split(" ")[1]
  if (!id_token) {
    res.status(401).json("Auth token missing")
  }

  const JWKS = createRemoteJWKSet(new URL(jwks_uri!))
  console.log('jwks-uri', jwks_uri, 'jwks->', JWKS);

  //TODO: id tokens last 10min, does not auto refresh in localstorage
  try {
    const { payload } = await jwtVerify(id_token!, JWKS)
    console.log('payload', payload)
    if (payload) {
      const result = await addUser(body.address, body.token_id, body.signer)
      res.json(result)
    }

  } catch (error: any) {
    if (error.payload) {
      if (error.code === "ERR_JWT_EXPIRED"
        && error.payload.act.sub === body.address.toLowerCase()
        && error.payload.sub === body.signer.toLowerCase()) {
        const result = await addUser(body.address, body.token_id, body.signer)
        res.json(result)
      }
    }
    res.json({ error: error.code })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})




