const config = {
  env: {
    dbUrl: process.env.DATABASE_URL!,
    auth: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    upstash: {
      redisUrl: process.env.UPSTASH_REDIS_URL!,
      redisToken: process.env.UPSTASH_REDIS_TOKEN!,
    },
  },
};

export default config;
