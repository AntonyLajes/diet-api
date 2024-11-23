import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_URL: z.string(),
    DB_CLIENT: z.enum(["sqlite", "pg"]),
    PORT: z.coerce.number().default(3333)
})

const _env = envSchema.safeParse(process.env)

if(!_env.success){
    console.log(`Error: Invalid environment variable: ${_env.error.format()}`);
    throw new Error(`Invalid environment variable: ${JSON.stringify(_env.error.format())}`)
}

export const env = _env.data