import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_URL: z.string(),
    DB_CLIENT: z.enum(["sqlite", "pg"])
})

const _env = envSchema.safeParse(process.env)

if(!_env.success){
    console.log(`Error: Invalid environment variable: ${_env.error.format()}`);
    throw new Error(`Invalid environment variable: ${_env.error.format()}`)
}

export const env = _env.data