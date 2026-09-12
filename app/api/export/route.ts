import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import ExcelJS from "exceljs"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      orderBy: [
        { role: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Team Members')

    // Set columns
    worksheet.columns = [
      { header: 'Sl No.', key: 'sl', width: 8 },
      { header: 'Branch', key: 'branch', width: 12 },
      { header: 'Role', key: 'role', width: 20 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Phone Number', key: 'phone', width: 15 },
      { header: 'Photos', key: 'photos', width: 30 } // Width for image
    ]

    // Style headers
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }

    members.forEach((member, index) => {
      // Map roles
      let roleDisplay = member.role
      if (member.role === 'CHIEF_COORDINATOR') roleDisplay = 'Chief Coordinator'
      else if (member.role === 'COORDINATOR') roleDisplay = 'Coordinator'
      else if (member.role === 'VOLUNTEER') roleDisplay = 'Volunteer'

      // Map branches
      let branchDisplay = member.branch
      if (branchDisplay.toLowerCase().includes('computer')) branchDisplay = 'CSE'
      else if (branchDisplay.toLowerCase().includes('mechanical')) branchDisplay = 'MECH'
      else if (branchDisplay.toLowerCase().includes('civil')) branchDisplay = 'CIVIL'
      else if (branchDisplay.toLowerCase().includes('electrical')) branchDisplay = 'EE'
      else if (branchDisplay.toLowerCase().includes('electronics')) branchDisplay = 'ECE'

      const row = worksheet.addRow({
        sl: index + 1,
        branch: branchDisplay,
        role: roleDisplay,
        name: member.fullName,
        phone: member.phone || "",
        photos: "" // We will inject the image here
      })

      row.height = 120 // Set row height to fit the ID card image

      // Check if auto-generated ID card PNG exists
      const idCardPath = path.join(process.cwd(), "public", "generated-ids", `${member.memberId}.png`)
      if (fs.existsSync(idCardPath)) {
        const imageId = workbook.addImage({
          filename: idCardPath,
          extension: 'png',
        })

        worksheet.addImage(imageId, {
          tl: { col: 5, row: index + 1 }, // col 5 is the 'Photos' column, row is index+1 (0-based for data after header)
          ext: { width: 150, height: 238 } // Roughly ID card proportions
        })
      }
    })

    worksheet.eachRow((row) => {
      row.alignment = { vertical: 'middle', horizontal: 'center' }
    })

    const buffer = await workbook.xlsx.writeBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="INSPRANO_2K26_Team_With_IDs.xlsx"',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }
    })
  } catch (error) {
    console.error("Failed to generate Excel:", error)
    return new NextResponse("Failed to generate Excel file", { status: 500 })
  }
}
