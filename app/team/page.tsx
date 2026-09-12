import prisma from "@/lib/prisma"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Member } from "@prisma/client"

export const dynamic = 'force-dynamic'

export default async function TeamPage() {
  const [chiefs, coordinators, volunteers] = await Promise.all([
    prisma.member.findMany({ where: { role: 'CHIEF_COORDINATOR', status: 'ACTIVE' }, orderBy: { createdAt: 'asc' } }),
    prisma.member.findMany({ where: { role: 'COORDINATOR', status: 'ACTIVE' }, orderBy: { createdAt: 'asc' } }),
    prisma.member.findMany({ where: { role: 'VOLUNTEER', status: 'ACTIVE' }, orderBy: { createdAt: 'asc' } }),
  ])

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Nav */}
      <nav className="p-6 border-b border-gray-900 flex justify-between items-center max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-wider">
          INSPRANO <span className="text-[#B1122B]">2K26</span>
        </Link>
        <div className="space-x-6 text-sm font-medium">
          <Link href="/" className="hover:text-[#B1122B] transition-colors">Home</Link>
          <Link href="/team" className="text-[#B1122B]">Team</Link>
        </div>
      </nav>

      {/* Header */}
      <header className="max-w-6xl mx-auto py-16 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">MEET THE TEAM</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          The people behind INSPRANO 2K26. Dedicated, passionate, and building a bolder tomorrow.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-24 space-y-24">
        {/* Chief Coordinators */}
        {chiefs.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-8 border-b border-gray-900 pb-4">
              <h2 className="text-2xl font-bold uppercase tracking-wider">Chief Coordinators</h2>
              <span className="text-sm text-gray-500">{chiefs.length} Members</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {chiefs.map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* Coordinators */}
        {coordinators.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-8 border-b border-gray-900 pb-4">
              <h2 className="text-xl font-bold uppercase tracking-wider">Coordinators</h2>
              <span className="text-sm text-gray-500">{coordinators.length} Members</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {coordinators.map(member => (
                <MemberCard key={member.id} member={member} compact />
              ))}
            </div>
          </section>
        )}

        {/* Volunteers */}
        {volunteers.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-8 border-b border-gray-900 pb-4">
              <h2 className="text-xl font-bold uppercase tracking-wider">Volunteers</h2>
              <span className="text-sm text-gray-500">{volunteers.length} Members</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {volunteers.map(member => (
                <MemberCard key={member.id} member={member} compact />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

function MemberCard({ member, compact = false }: { member: Member, compact?: boolean }) {
  const isVolunteer = member.role === 'VOLUNTEER'
  const fallbackImage = member.role === 'COORDINATOR'
    ? '/coordinator.png'
    : member.role === 'VOLUNTEER'
      ? '/volunteer.png'
      : null
  const imageSource = isVolunteer ? '/volunteer.png' : member.profileImage || fallbackImage

  return (
    <div className="group bg-[#0A0A0A] rounded-2xl overflow-hidden border border-gray-900 hover:border-[#B1122B]/50 transition-all duration-300">
      <div className={`w-full bg-gray-900 ${compact ? 'aspect-square' : 'h-72'} relative overflow-hidden`}>
        {imageSource ? (
          <img 
            src={imageSource} 
            alt={isVolunteer ? '' : member.fullName}
            aria-hidden={isVolunteer}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-700">
            {member.fullName.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-80" />
      </div>
      
      <div className="p-5 relative -mt-16 z-10">
        <h3 className={`font-bold text-white ${compact ? 'text-lg' : 'text-xl'} truncate`}>{member.fullName}</h3>
        {!isVolunteer && (
          <p className="text-xs text-[#B1122B] font-bold tracking-wider mt-1 mb-3">
            {member.role.replace('_', ' ')}
          </p>
        )}
        
        <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-900 pt-3">
          <span className="truncate pr-2">{member.branch}</span>
          {!isVolunteer && (
            <Link href={`/member/${member.memberId}`} className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 hover:bg-[#B1122B] text-white transition-colors">
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
