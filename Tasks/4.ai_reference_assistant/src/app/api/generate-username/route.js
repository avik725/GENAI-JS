export async function POST(req) {
  try {
    const { name } = await req.json()

    if (!name || typeof name !== "string") {
      return Response.json({ error: "Name is required" }, { status: 400 })
    }

    // Generate username based on name
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "")
    const randomSuffix = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0")
    const username = `${cleanName}${randomSuffix}`

    return Response.json({ username })
  } catch (error) {
    console.error("Error generating username:", error)
    return Response.json({ error: "Failed to generate username" }, { status: 500 })
  }
}
