import express from "express"

const app = express()
const PORT = process.env.PORT || 3000
const WHOP_API_TOKEN = process.env.WHOP_API_TOKEN
const OMNIHOOK_PRODUCT_ID = "prod_gRSgmVbbJRipf"

app.use(express.json())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Content-Type")
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
  if (req.method === "OPTIONS") {
    return res.sendStatus(204)
  }
  next()
})

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "OmniHook validation backend is running." })
})

app.post("/validate-license", async (req, res) => {
  if (!WHOP_API_TOKEN) {
    return res.status(500).json({ status: "error", message: "Server misconfigured: WHOP_API_TOKEN is required." })
  }

  const { licenseKey, deviceId } = req.body || {}
  if (!licenseKey || !deviceId) {
    return res.status(400).json({ status: "error", message: "licenseKey and deviceId are required." })
  }

  try {
    const response = await fetch(`https://api.whop.com/api/v2/memberships/${encodeURIComponent(licenseKey)}/validate_license`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHOP_API_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        metadata: {
          source: "omnihook_framer_plugin",
          device_id: deviceId
        }
      })
    })

    if (response.status >= 500) {
      return res.status(502).json({ status: "error", message: "Whop server error." })
    }

    if (response.status === 401 || response.status === 403) {
      return res.status(401).json({ status: "error", message: "Validation server credentials are invalid." })
    }

    const data = await response.json()
    const productId = data?.product
    const isCorrectProduct = productId === OMNIHOOK_PRODUCT_ID

    if (data.valid && isCorrectProduct) {
      return res.json({ status: "valid" })
    }

    if (data.valid && !isCorrectProduct) {
      return res.json({ status: "invalid", message: "License key is not valid for OmniHook." })
    }

    return res.json({ status: "invalid", message: "License key is inactive or expired." })
  } catch (error) {
    console.error("Whop validation backend error:", error)
    return res.status(502).json({ status: "error", message: "Validation service unavailable." })
  }
})

app.listen(PORT, () => {
  console.log(`OmniHook validation backend listening on http://localhost:${PORT}`)
})
