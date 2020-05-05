const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const { Pool } = require('pg')
const redis = require('redis')

const {
  redisHost,
  redisPort,
  pgUser,
  pgHost,
  pgDatabase,
  pgPassword,
  pgPort
} = require('./keys')

const app = express()

app.use(cors())
app.use(bodyParser.json())

const pgClient = new Pool({
  user: pgUser,
  host: pgHost,
  database: pgDatabase,
  password: pgPassword,
  port: pgPort
})

pgClient.on('error', () => {
  console.error('Lost PG connection !!!')
})

pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch((err) => {
    console.error(err)
  })

const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000
})

const redisPublisher = redisClient.duplicate()

app.get('/', (req, res) => {
  return res.send('Hi !!')
})

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values')
  return res.send(values.rows)
})

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    return res.send(values)
  })
})

app.post('/values', async (req, res) => {
  const { index } = req.body
  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high')
  }
  redisClient.hset('values', index, 'Noting yet!')
  redisPublisher.publish('insert', index)
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index])
  return res.send({ working: true })
})

app.listen(5000, (err) => {
  console.log(`server running at port:5000`)
})
