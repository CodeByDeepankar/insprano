"use server"

import prisma from "../prisma"
import { Role, Status } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { removeStoredFiles, uploadDataUrl } from "../storage"

export async function generateUniqueId(role: Role): Promise<string> {
  const prefixMap = {
    [Role.CHIEF_COORDINATOR]: "INS26-CC-",
    [Role.COORDINATOR]: "INS26-CO-",
    [Role.VOLUNTEER]: "INS26-VO-",
  }

  const prefix = prefixMap[role]

  // Find the member with the highest ID for this role
  const lastMember = await prisma.member.findFirst({
    where: { role },
    orderBy: { memberId: "desc" },
  })

  let nextNumber = 1
  if (lastMember) {
    const lastId = lastMember.memberId
    // Extract the number part from INS26-XX-001
    const numberPart = lastId.replace(prefix, "")
    const parsedNumber = parseInt(numberPart, 10)
    if (!isNaN(parsedNumber)) {
      nextNumber = parsedNumber + 1
    }
  }

  // Format as 3 digits
  const paddedNumber = nextNumber.toString().padStart(3, "0")
  return `${prefix}${paddedNumber}`
}

export async function generateSlug(fullName: string): Promise<string> {
  let baseSlug = fullName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")

  let slug = baseSlug
  let counter = 1
  
  while (true) {
    const existing = await prisma.member.findUnique({ where: { slug } })
    if (!existing) break
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

export type MemberInput = {
  fullName: string
  role: Role
  branch: string
  year?: string
  email?: string
  phone?: string
  bio?: string
  profileImage?: string
  idCardBase64?: string
}

export async function createMember(data: MemberInput) {
  try {
    const memberId = await generateUniqueId(data.role)
    const slug = await generateSlug(data.fullName)

    const { idCardBase64, profileImage, ...memberData } = data
    const profileImageUrl = profileImage
      ? await uploadDataUrl(profileImage, `${memberId}/profile.webp`)
      : undefined

    const member = await prisma.member.create({
      data: {
        ...memberData,
        profileImage: profileImageUrl,
        memberId,
        slug,
        status: Status.ACTIVE,
      }
    })

    if (idCardBase64) {
      await uploadDataUrl(idCardBase64, `${memberId}/id-card.png`)
    }

    revalidatePath("/admin")
    revalidatePath("/admin/members")
    
    return { success: true, member }
  } catch (error: any) {
    console.error("Error creating member:", error)
    return { success: false, error: error.message }
  }
}

export async function updateMember(memberId: string, data: Partial<MemberInput>) {
  try {
    const { idCardBase64, profileImage, ...memberData } = data
    const profileImageUrl = profileImage
      ? await uploadDataUrl(profileImage, `${memberId}/profile.webp`)
      : profileImage === ""
        ? null
        : undefined

    const member = await prisma.member.update({
      where: { memberId },
      data: { ...memberData, profileImage: profileImageUrl }
    })

    if (idCardBase64) {
      await uploadDataUrl(idCardBase64, `${memberId}/id-card.png`)
    }

    revalidatePath("/admin")
    revalidatePath("/admin/members")
    revalidatePath(`/member/${memberId}`)
    
    return { success: true, member }
  } catch (error: any) {
    console.error("Error updating member:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteMember(memberId: string) {
  try {
    await prisma.member.delete({
      where: { memberId }
    })

    await removeStoredFiles([
      `${memberId}/profile.webp`,
      `${memberId}/id-card.png`,
    ])

    revalidatePath("/admin")
    revalidatePath("/admin/members")
    
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting member:", error)
    return { success: false, error: error.message }
  }
}
