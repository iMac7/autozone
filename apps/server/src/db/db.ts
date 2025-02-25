import postgres from 'postgres'
import { db_url } from '../utils/env'

const sql = postgres(db_url!)

export default sql