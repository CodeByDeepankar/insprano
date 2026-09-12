import prisma from "@/lib/prisma"
import Link from "next/link"
import { Plus, Search, Filter } from "lucide-react"
import { MemberActions } from "@/components/admin/MemberActions"

export const dynamic = 'force-dynamic'

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>
}) {
  const params = await searchParams
  const query = params.q || ""
  const roleFilter = params.role || ""

  const whereClause: any = {}
  
  if (query) {
    whereClause.OR = [
      { fullName: { contains: query, mode: 'insensitive' } },
      { memberId: { contains: query, mode: 'insensitive' } },
    ]
  }

  if (roleFilter && roleFilter !== 'ALL') {
    whereClause.role = roleFilter
  }

  const members = await prisma.member.findMany({
    where: whereClause,
    orderBy: [
      { role: 'asc' },
      { memberId: 'asc' }
    ]
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Team Members</h1>
          <p className="text-gray-400 mt-1">Manage all INSPRANO 2K26 team members.</p>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href="/api/export" 
            className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm border border-green-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export Excel
          </a>
          <Link 
            href="/admin/members/new" 
            className="flex items-center gap-2 bg-[#B1122B] hover:bg-[#6E1020] text-white px-4 py-2 rounded-md transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#0A0A0A] border border-gray-900 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            defaultValue={query}
            className="w-full bg-black border border-gray-800 rounded-md pl-10 pr-4 py-2 text-sm text-white focus:border-[#B1122B] focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select 
            defaultValue={roleFilter}
            className="bg-black border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:border-[#B1122B] focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="CHIEF_COORDINATOR">Chief Coordinators</option>
            <option value="COORDINATOR">Coordinators</option>
            <option value="VOLUNTEER">Volunteers</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-[#0A0A0A] border border-gray-900 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/50 text-xs uppercase text-gray-500 border-b border-gray-900">
              <tr>
                <th className="px-6 py-4 font-medium">Member</th>
                <th className="px-6 py-4 font-medium">Member ID</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Branch</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700">
                        {member.profileImage ? (
                          <img src={member.profileImage} alt={member.fullName} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-gray-400 text-sm font-medium">{member.fullName.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{member.fullName}</span>
                        <span className="text-xs text-gray-500">{member.email || "No email"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-gray-300">{member.memberId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-gray-400">
                      {member.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{member.branch}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      member.status === 'ACTIVE' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <MemberActions memberId={member.memberId} />
                  </td>
                </tr>
              ))}
              
              {members.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-gray-900 flex items-center justify-center mb-3">
                        <Search className="w-5 h-5 text-gray-500" />
                      </div>
                      <p className="text-gray-400 font-medium">No members found</p>
                      <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or add a new member.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
