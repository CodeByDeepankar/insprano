import { NextResponse } from "next/server"
import { uploadDataUrl } from "@/lib/storage"

export async function POST(request: Request) {
  try {
    const { memberId, base64 } = await request.json()

    if (!memberId || !base64) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    const url = await uploadDataUrl(base64, `${memberId}/id-card.png`)

    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error("Failed to save ID card:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
