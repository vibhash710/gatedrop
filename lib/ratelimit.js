import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Different limits for different actions
export const rateLimits = {
  // Auth — strict
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "15 m"),
    prefix: "rl:auth",
  }),

  // Email sending — very strict
  email: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "rl:email",
  }),

  // Checkout — moderate
  checkout: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "15 m"),
    prefix: "rl:checkout",
  }),

  // Download — moderate
  download: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "15 m"),
    prefix: "rl:download",
  }),

  // General API
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "15 m"),
    prefix: "rl:api",
  }),
}