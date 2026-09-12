import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    const { memberId, base64 } = await request.json()

    if (!memberId || !base64) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    const base64Data = base64.replace(/^data:image\/png;base64,/, "")
    const filePath = path.join(process.cwd(), "public", "generated-ids", `${memberId}.png`)
    
    // Ensure directory exists
    const dirPath = path.dirname(filePath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    
    fs.writeFileSync(filePath, base64Data, "base64")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save ID card:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
