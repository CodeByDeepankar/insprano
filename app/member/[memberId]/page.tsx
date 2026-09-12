import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Github, Instagram, Linkedin, Mail, CheckCircle, AlertTriangle } from "lucide-react"

export default async function MemberProfilePage({ params }: { params: Promise<{ memberId: string }> }) {
  const resolvedParams = await params
  
  const member = await prisma.member.findUnique({
    where: { memberId: resolvedParams.memberId },
    include: {
      works: true,
      responsibilities: true,
      eventContributions: true,
      socialLinks: true,
    }
  })

  if (!member) {
    notFound()
  }

  const isVerified = member.status === "ACTIVE"

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header/Nav */}
      <nav className="p-6 border-b border-gray-900 flex justify-between items-center max-w-5xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-wider">
          INSPRANO <span className="text-[#B1122B]">2K26</span>
        </Link>
        <Link href="/team" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Back to Team
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#0A0A0A] border border-gray-900 rounded-2xl overflow-hidden relative">
            {/* Red accent at top */}
            <div className="h-2 bg-gradient-to-r from-[#B1122B] to-[#6E1020]" />
            
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1A1A1A] mb-4 relative bg-gray-900">
                {member.profileImage ? (
                  <img src={member.profileImage} alt={member.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-gray-600 flex items-center justify-center h-full">
                    {member.fullName.charAt(0)}
                  </span>
                )}
                {isVerified && (
                  <div className="absolute bottom-0 right-2 bg-green-500 rounded-full p-1 border-2 border-[#0A0A0A]">
                    <CheckCircle className="w-4 h-4 text-black" />
                  </div>
                )}
              </div>
              
              <h1 className="text-2xl font-bold">{member.fullName}</h1>
              
              <div className="mt-2 inline-block px-3 py-1 bg-[#B1122B] text-white text-xs font-bold rounded-full uppercase tracking-wider">
                {member.role.replace('_', ' ')}
              </div>
              
              <div className="mt-4 text-sm font-mono text-gray-400 bg-black px-3 py-1.5 rounded-md border border-gray-800">
                ID: {member.memberId}
              </div>

              <div className="w-full h-px bg-gray-900 my-6" />
              
              <div className="w-full text-left space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 text-[#B1122B]">🎓</span>
                  <span>{member.branch}</span>
                </div>
                {member.year && (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 text-[#B1122B]">📅</span>
                    <span>{member.year}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 text-[#B1122B]">📍</span>
                  <span>GCE Kalahandi, Bhawanipatna</span>
                </div>
              </div>

              {/* Verification Badge */}
              <div className={`mt-6 w-full p-4 rounded-xl flex items-start gap-3 border ${
                isVerified ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
              }`}>
                {isVerified ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-green-500">Verified Member</p>
                      <p className="text-xs text-gray-400 mt-1">This member is an official part of the INSPRANO 2K26 team.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-red-500">Invalid or Inactive</p>
                      <p className="text-xs text-gray-400 mt-1">This ID is currently not active in our system.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="md:col-span-2 space-y-8">
          {/* About Section */}
          <section>
            <h2 className="text-xl font-bold border-b border-gray-900 pb-2 mb-4 flex items-center gap-2">
              About Me
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              {member.bio || "This member hasn't added a bio yet."}
            </p>
          </section>

          {/* Responsibilities */}
          {member.responsibilities.length > 0 && (
            <section>
              <h2 className="text-xl font-bold border-b border-gray-900 pb-2 mb-4">Responsibilities</h2>
              <ul className="space-y-3">
                {member.responsibilities.map(resp => (
                  <li key={resp.id} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle className="w-5 h-5 text-[#B1122B] shrink-0" />
                    <span>{resp.title}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Works */}
          {member.works.length > 0 && (
            <section>
              <h2 className="text-xl font-bold border-b border-gray-900 pb-2 mb-4">Works & Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {member.works.map(work => (
                  <div key={work.id} className="bg-[#0A0A0A] border border-gray-900 p-4 rounded-xl hover:border-gray-700 transition-colors">
                    <h3 className="font-bold text-white text-sm">{work.title}</h3>
                    {work.category && <span className="text-xs text-[#B1122B] mt-1 block">{work.category}</span>}
                    {work.description && <p className="text-xs text-gray-400 mt-2">{work.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
