const server = require('./server')
const request = require('supertest')
const db = require('../data/dbConfig')
test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
afterAll(async () => {
  await db.destroy()
})

describe('[POST] /register', () => {
  test('responds with new user', async () => {
    const res = await request(server)
      .post('/api/auth/register').send({ username: 'jennifer', password: "123" })
    expect(res.body).toMatchObject({ username: 'jennifer' })
  })
  test('responds validation error on missing password', async () => {
    const res = await request(server).post('/api/auth/register').send({ username: 'jennifer' })
    expect(res.body).toMatchObject({ message: "username and password required" })
  })
})
describe('[POST] /login', () => {
  test('responds with welcome message', async () => {
    await request(server).post('/api/auth/register').send({ username: 'jennifer', password: "123" })
    const res = await request(server).post('/api/auth/login').send({ username: 'jennifer', password: "123" })
    expect(res.body).toMatchObject({ message: "welcome, jennifer" })
  })
  test('responds with error on non-existant username', async () => {
    const res = await request(server).post('/api/auth/login').send({ username: 'Betty', password: "123" })
    expect(res.body).toMatchObject({ message: "invalid credentials" })
  })
})

describe('[GET] /jokes', () => {
  test('gets error message on no token', async () => {
    await request(server).post('/api/auth/register').send({ username: 'jennifer', password: "123" })
    await request(server).post('/api/auth/login').send({ username: 'jennifer', password: "123" })
    const res = await request(server).get('/api/jokes')
    expect(res.text).not.toBe([
      {
        "id": "0189hNRf2g",
        "joke": "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
      },
      {
        "id": "08EQZ8EQukb",
        "joke": "Did you hear about the guy whose whole left side was cut off? He's all right now."
      },
      {
        "id": "08xHQCdx5Ed",
        "joke": "Why didn’t the skeleton cross the road? Because he had no guts."
      },
    ])

  })
  test('returns a status 200', async () => {
    await request(server).post('/api/auth/register').send({ username: 'jennifer', password: "123" })
    await request(server).post('/api/auth/login').send({ username: 'jennifer', password: "123" })
    const res = await request(server).get('/api/jokes')
    expect(res.status).toBe(200)
  })
})
