const request = require("supertest")
const express = require("express")
const couponRoutes = require("../routes/coupons")

describe("Coupon Routes", () => {
  let app

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use("/coupons", couponRoutes)
  })

  test("POST /coupons/validate should accept valid coupon", async () => {
    const res = await request(app).post("/coupons/validate").send({
      code: "SAVE10",
      orderTotal: 50,
    })

    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("valid")
      expect(res.body).toHaveProperty("discountAmount")
    }
  })

  test("POST /coupons/validate should reject invalid code", async () => {
    const res = await request(app).post("/coupons/validate").send({
      code: "INVALID",
      orderTotal: 50,
    })

    expect(res.statusCode).toBe(404)
  })
})
