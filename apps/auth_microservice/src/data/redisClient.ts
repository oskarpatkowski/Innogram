import { createClient } from 'redis'
import config from '../config/config.ts'


export const redisClient = createClient({
  url: `redis://${config.redisUname}:${config.redisPassword}@localhost:${config.redisPort}`,
});

redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.connect().then(() => {
  console.log('Connected to Redis');
});

process.on('SIGTERM', async () => {
  console.log('Disconnecting from Redis...');
  await redisClient.quit();
})