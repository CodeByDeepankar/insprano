import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export default async function AdminDashboard() {
  const session = await auth()
  
  const [
    totalMembers,
    chiefCoordinators,
    coordinators,
    volunteers,
    activeMembers,
    inactiveMembers,
    recentMembers
  ] = await Promise.all([
    prisma.member.count(),
    prisma.member.count({ where: { role: 'CHIEF_COORDINATOR' } }),
    prisma.member.count({ where: { role: 'COORDINATOR' } }),
    prisma.member.count({ where: { role: 'VOLUNTEER' } }),
    prisma.member.count({ where: { status: 'ACTIVE' } }),
    prisma.member.count({ where: { status: { not: 'ACTIVE' } } }),
    prisma.member.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back, {session?.user?.name || 'Admin'}!</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={totalMembers} />
        <StatCard title="Chief Coordinators" value={chiefCoordinators} />
        <StatCard title="Coordinators" value={coordinators} />
        <StatCard title="Volunteers" value={volunteers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0A0A0A] p-6 rounded-xl border border-gray-900 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-gray-400">Active Members</h3>
            <p className="text-3xl font-bold mt-2 text-green-500">{activeMembers}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
             ✓
          </div>
        </div>
        <div className="bg-[#0A0A0A] p-6 rounded-xl border border-gray-900 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-gray-400">Inactive/Suspended</h3>
            <p className="text-3xl font-bold mt-2 text-red-500">{inactiveMembers}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
             ×
          </div>
        </div>
      </div>

      {/* Recent Members */}
      <div className="bg-[#0A0A0A] rounded-xl border border-gray-900 overflow-hidden">
        <div className="p-6 border-b border-gray-900 flex justify-between items-center">
          <h2 className="text-xl font-bold">Recent Members</h2>
          <a href="/admin/members" className="text-sm text-[#B1122B] hover:text-red-400">View All →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3">Member</th>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {recentMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-900/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                      {member.profileImage ? (
                        <img src={member.profileImage} alt={member.fullName} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-gray-500 text-lg">{member.fullName.charAt(0)}</span>
                      )}
                    </div>
                    <span className="font-medium">{member.fullName}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm font-mono">{member.memberId}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{member.role.replace('_', ' ')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
              
              {recentMembers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No members found. Add some to get started.
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

function StatCard({ title, value }: { title: string, value: number }) {
  return (
    <div className="bg-[#0A0A0A] p-6 rounded-xl border border-gray-900">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}
