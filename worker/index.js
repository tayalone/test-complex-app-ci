const redis = require('redis')

const { redisHost, redisPort } = require('./keys')

const redisClient = redis.redisClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000 // ถ้า redis พังจะต่อใหม่ทุกๆ 1000 ms
})

const sub = redisClient.duplicate()

const fib = (index) => {
  if (index < 2) {
    return 1
  } else {
    return fib(index - 1) + fib(index - 2)
  }
}
