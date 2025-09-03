import { createClient } from 'redis'

export let redisClient: ReturnType<typeof createClient>

export async function connectRedis() {
  const port = Number(process.env.REDIS_PORT)
  const host = process.env.REDIS_HOST
  const username = process.env.REDIS_USERNAME
  const password = process.env.REDIS_PASSWORD

  if (!host || !port) {
    throw new Error('Redis host or port is missing in .env')
  }

  redisClient = createClient({
    username,
    password,
    socket: { host, port },
  })

  redisClient.on('error', (err) => console.error('Redis Client Error:', err))

  await redisClient.connect()
}
