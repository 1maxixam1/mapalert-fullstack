import 'dotenv/config'
import fs from 'fs'
import { Client } from 'pg'
const sql = fs.readFileSync(new URL('../migrations/001_init.sql', import.meta.url), 'utf8')
const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
try { await client.query(sql); console.log('Migration OK') } catch(e){ console.error('Migration failed', e); process.exit(1) } finally { await client.end() }
