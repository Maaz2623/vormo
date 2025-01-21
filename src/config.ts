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
    imageKit: {
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
      privateKey: process.env.IMAGE_KIT_PRIVATE_KEY!,
    },
  },
};

export default config;
