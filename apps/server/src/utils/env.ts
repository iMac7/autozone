import dotenv from 'dotenv';

dotenv.config();

export const client_id = process.env.CLIENT_ID
export const redirect_uri = process.env.REDIRECT_URI
export const api_key = process.env.API_KEY
export const developer_jwt = process.env.DEVELOPER_JWT
export const vehicle_jwt = process.env.VEHICLE_JWT
export const jwks_uri = process.env.JWKS_URI
export const db_url = process.env.DATABASE_URL