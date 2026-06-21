export default async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*")
  response.setHeader("Access-Control-Allow-Headers", "Content-Type")
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS")

  if (request.method === "OPTIONS") {
    return response.status(204).end()
  }

  if (request.method !== "POST") {
    return response.status(405).json({ status: "error", message: "Method not allowed." })
  }

  const WHOP_API_TOKEN = process.env.WHOP_API_TOKEN
  if (!WHOP_API_TOKEN) {
    return response.status(500).json({ status: "error", message: "Server misconfigured: WHOP_API_TOKEN is required." })
  }

  const { licenseKey, deviceId } = request.body || {}
  if (!licenseKey || !deviceId) {
    return response.status(400).json({ status: "error", message: "licenseKey and deviceId are required." })
  }

  try {
    const whopResponse = await fetch(
      `https://api.whop.com/api/v2/memberships/${encodeURIComponent(licenseKey)}/validate_license`,
      {
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
      }
    )

    if (whopResponse.status >= 500) {
      return response.status(502).json({ status: "error", message: "Whop server error." })
    }

    if (whopResponse.status === 401 || whopResponse.status === 403) {
      return response.status(401).json({ status: "error", message: "Validation server credentials are invalid." })
    }

    const data = await whopResponse.json()
    const productId = data?.product
    const isCorrectProduct = productId === "prod_gRSgmVbbJRipf"

    if (data.valid && isCorrectProduct) {
      return response.json({ status: "valid" })
    }

    if (data.valid && !isCorrectProduct) {
      return response.json({ status: "invalid", message: "License key is not valid for OmniHook." })
    }

    return response.json({ status: "invalid", message: "License key is inactive or expired." })
  } catch (error) {
    console.error("Whop validation backend error:", error)
    return response.status(502).json({ status: "error", message: "Validation service unavailable." })
  }
}
