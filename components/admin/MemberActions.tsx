"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal } from "lucide-react"
import { deleteMember } from "@/lib/actions/member.actions"
import Link from "next/link"

export function MemberActions({ memberId }: { memberId: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this member? This action cannot be undone.")) return

    setIsDeleting(true)
    const result = await deleteMember(memberId)
    if (result.success) {
      router.refresh()
    } else {
      alert("Failed to delete member: " + result.error)
      setIsDeleting(false)
    }
  }

  return (
    <details className="relative inline-block text-left">
      <summary className="flex h-8 w-8 cursor-pointer list-none items-center justify-center text-gray-500 transition-colors hover:text-white">
        <span className="sr-only">Open member actions</span>
        <MoreHorizontal className="h-4 w-4" />
      </summary>
      <div className="absolute right-0 z-20 mt-2 w-40 rounded-md border border-gray-900 bg-[#0A0A0A] p-1 text-left text-sm text-white shadow-xl">
        <p className="px-3 py-2 text-xs font-semibold text-gray-400">Actions</p>
        <Link
          href={`/member/${memberId}`}
          className="block rounded px-3 py-2 hover:bg-gray-900"
        >
          View profile
        </Link>
        <Link
          href={`/admin/members/${memberId}/edit`}
          className="block rounded px-3 py-2 hover:bg-gray-900"
        >
          Edit member
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="block w-full rounded px-3 py-2 text-left text-red-500 hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </details>
  )
}
