import { dimo } from ".."
import sql from "../db/db"
import { api_key, client_id, redirect_uri } from "./env"

export async function getDeveloperJwt() {
    const authHeader = await dimo.auth.getToken({
        client_id,
        domain: redirect_uri,
        private_key: api_key,
    })
    return authHeader
}

export async function getVehicleJwt() {
    const developer_jwt = await getDeveloperJwt()
    const vehicleJwt = await dimo.tokenexchange.exchange({
        ...developer_jwt,
        privileges: [1, 3, 4],
        tokenId: 17
    })
    console.log('vehicleJwt', vehicleJwt);
    return vehicleJwt
}

export async function getLeaderboard() {
    const users = await sql`SELECT * FROM users`
    return users
}

export async function getAllVehicles() {
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

    const vehicles = await dimo.identity.query({ query })
    return vehicles
}

export async function getVehicleByTokenId(tokenId: number) {
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

    const vehicle = await dimo.identity.query({ query })
    return vehicle
}


export async function addUser(address: string, token_id: string, signer: string) {
    const result = await sql`
      INSERT INTO users (address, token_id, signer)
      VALUES (${address}, ${token_id}, ${signer})
      RETURNING *;
    `;
    return result;
}

export async function getUserByAddress(address: string) {
    const user = await sql`
      SELECT * FROM users
      WHERE address = ${address}
      LIMIT 1;
    `;
    return user;
}

export async function telemetryData() {
    const query = `
    {
    signals(
      tokenId: 17
      from: "2025-02-08T00:00:00Z"
      to: "2025-02-22T00:00:00Z"
      interval: "1h"
    ) {
      timestamp
      maxSpeed: speed(agg: MAX)
      avgSpeed: speed(agg: AVG)
      
    }
  }
    `

    return (
        {
            "data": {
                "signals": [
                    {
                        "timestamp": "2025-02-08T01:00:00Z",
                        "maxSpeed": 0,
                        "avgSpeed": 0
                    },
                    {
                        "timestamp": "2025-02-09T01:00:00Z",
                        "maxSpeed": 0,
                        "avgSpeed": 0
                    },
                    {
                        "timestamp": "2025-02-09T19:00:00Z",
                        "maxSpeed": 56,
                        "avgSpeed": 10.48076923076923
                    },
                    {
                        "timestamp": "2025-02-09T20:00:00Z",
                        "maxSpeed": 58,
                        "avgSpeed": 11.885714285714286
                    },
                    {
                        "timestamp": "2025-02-10T20:00:00Z",
                        "maxSpeed": 0,
                        "avgSpeed": 0
                    },
                    {
                        "timestamp": "2025-02-11T00:00:00Z",
                        "maxSpeed": 59,
                        "avgSpeed": 16.35632183908046
                    },
                    {
                        "timestamp": "2025-02-11T02:00:00Z",
                        "maxSpeed": 0,
                        "avgSpeed": 0
                    },
                    {
                        "timestamp": "2025-02-11T03:00:00Z",
                        "maxSpeed": 63,
                        "avgSpeed": 25.40983606557377
                    },
                    {
                        "timestamp": "2025-02-12T03:00:00Z",
                        "maxSpeed": 3,
                        "avgSpeed": 3
                    },
                    {
                        "timestamp": "2025-02-12T14:00:00Z",
                        "maxSpeed": 3,
                        "avgSpeed": 1.0344827586206897
                    },
                    {
                        "timestamp": "2025-02-12T15:00:00Z",
                        "maxSpeed": 50,
                        "avgSpeed": 9.529411764705882
                    },
                    {
                        "timestamp": "2025-02-12T16:00:00Z",
                        "maxSpeed": 0,
                        "avgSpeed": 0
                    },
                    {
                        "timestamp": "2025-02-12T17:00:00Z",
                        "maxSpeed": 51,
                        "avgSpeed": 23.97222222222222
                    },
                    {
                        "timestamp": "2025-02-13T17:00:00Z",
                        "maxSpeed": 0,
                        "avgSpeed": 0
                    },
                    {
                        "timestamp": "2025-02-14T17:00:00Z",
                        "maxSpeed": 0,
                        "avgSpeed": 0
                    },
                    {
                        "timestamp": "2025-02-15T17:00:00Z",
                        "maxSpeed": 0,
                        "avgSpeed": 0
                    },
                    {
                        "timestamp": "2025-02-15T20:00:00Z",
                        "maxSpeed": 0,
                        "avgSpeed": 0
                    },
                    {
                        "timestamp": "2025-02-15T21:00:00Z",
                        "maxSpeed": 0,
                        "avgSpeed": 0
                    },
                    {
                        "timestamp": "2025-02-15T22:00:00Z",
                        "maxSpeed": 0,
                        "avgSpeed": 0
                    },
                    {
                        "timestamp": "2025-02-16T22:00:00Z",
                        "maxSpeed": 0,
                        "avgSpeed": 0
                    },
                    {
                        "timestamp": "2025-02-17T22:00:00Z",
                        "maxSpeed": 0,
                        "avgSpeed": 0
                    },
                    {
                        "timestamp": "2025-02-18T22:00:00Z",
                        "maxSpeed": 0,
                        "avgSpeed": 0
                    },
                    {
                        "timestamp": "2025-02-19T22:00:00Z",
                        "maxSpeed": 0,
                        "avgSpeed": 0
                    },
                    {
                        "timestamp": "2025-02-20T22:00:00Z",
                        "maxSpeed": 0,
                        "avgSpeed": 0
                    },
                    {
                        "timestamp": "2025-02-21T22:00:00Z",
                        "maxSpeed": 0,
                        "avgSpeed": 0
                    }
                ]
            }
        })
}

export async function getTelemetryData(tokenId: number) {
    const query = `
    {
      signals(
        tokenId: ${tokenId}
        from: "2025-02-08T00:00:00Z"
        to: "2025-02-22T00:00:00Z"
        interval: "1h"
      ) {
        timestamp
        maxSpeed: speed(agg: MAX)
        avgSpeed: speed(agg: AVG)
      }
    }
    `;

    const result = await telemetryData()

    const signals = result.data.signals;
    const maxSpeeds = signals.map(signal => signal.maxSpeed).filter(speed => speed > 0);
    const avgSpeeds = signals.map(signal => signal.avgSpeed).filter(speed => speed > 0);

    const averageMaxSpeed = maxSpeeds.length > 0 ? maxSpeeds.reduce((a, b) => a + b, 0) / maxSpeeds.length : 0;
    const averageAvgSpeed = avgSpeeds.length > 0 ? avgSpeeds.reduce((a, b) => a + b, 0) / avgSpeeds.length : 0;

    const userQuery = `
      SELECT id FROM users WHERE token_id = ${tokenId}
    `;
    const userResult = await sql`${userQuery}`
    const userId = userResult[0]?.id

    const timestamp = new Date("2025-02-22T00:00:00Z")
    await sql`
      INSERT INTO stats (user_id, timestamp, max_speed, avg_speed)
      VALUES (${userId}, ${timestamp}, ${averageMaxSpeed}, ${averageAvgSpeed});
    `;

    return {
        averageMaxSpeed,
        averageAvgSpeed,
        userId,
        timestamp
    };
}
