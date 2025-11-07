const request = require("supertest")
const express = require("express")
const authRoutes = require("../routes/auth")

describe("Auth Routes", () => {
  let app

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use("/auth", authRoutes)
  })

  test("POST /auth/register should create a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty("user")
    expect(res.body.user.email).toBe("test@example.com")
  })

  test("POST /auth/login should return tokens on valid credentials", async () => {
    // First register a user
    await request(app).post("/auth/register").send({
      name: "Test User",
      email: "login@example.com",
      password: "password123",
    })

    // Then try to login
    const res = await request(app).post("/auth/login").send({
      email: "login@example.com",
      password: "password123",
    })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("accessToken")
  })

  test("POST /auth/login should fail with invalid password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "nonexistent@example.com",
      password: "wrongpassword",
    })

    expect(res.statusCode).toBe(401)
    expect(res.body).toHaveProperty("error")
  })
})
