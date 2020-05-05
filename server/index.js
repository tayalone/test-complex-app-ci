const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const { Pool } = require('pg')

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
