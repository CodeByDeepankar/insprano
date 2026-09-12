import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle, XCircle } from "lucide-react"

export default async function VerifyPage({ params }: { params: Promise<{ memberId: string }> }) {
  const resolvedParams = await params
  
  const member = await prisma.member.findUnique({
    where: { memberId: resolvedParams.memberId }
  })

  // If member doesn't exist, we still show the page but with invalid status
  // so the QR code scanner gives a clear "INVALID" message rather than a 404
  const isValid = member && member.status === "ACTIVE"

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0A0A0A] border border-gray-900 rounded-3xl overflow-hidden shadow-2xl relative text-center">
        {/* Top Header */}
        <div className="p-6 pb-8 bg-black/50 border-b border-gray-900">
          <h1 className="text-xl font-bold tracking-widest text-white">
            INSPRANO <span className="text-[#B1122B]">2K26</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Official ID Verification</p>
        </div>

        {/* Status Icon */}
        <div className="relative -mt-8 mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[#0A0A0A] p-1">
            {isValid ? (
              <CheckCircle className="w-full h-full text-green-500 bg-[#0A0A0A] rounded-full" />
            ) : (
              <XCircle className="w-full h-full text-red-500 bg-[#0A0A0A] rounded-full" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-10">
          {isValid && member ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-green-500 tracking-wide">VERIFIED MEMBER</h2>
              <p className="text-gray-400 text-sm">
                This is an official INSPRANO 2K26 team member.
              </p>
              
              <div className="bg-black/50 border border-gray-800 rounded-xl p-4 mt-6 text-left flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-900 overflow-hidden shrink-0 border border-gray-800">
                  {member.profileImage ? (
                    <img src={member.profileImage} alt={member.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl text-gray-600 font-bold">
                      {member.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight">{member.fullName}</h3>
                  <p className="text-xs font-bold text-[#B1122B] mt-1">{member.role.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-400 font-mono mt-1">{member.memberId}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-900 text-left space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Branch:</span>
                  <span className="text-white">{member.branch}</span>
                </div>
                {member.year && (
                  <div className="flex justify-between">
                    <span>Year:</span>
                    <span className="text-white">{member.year}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>College:</span>
                  <span className="text-white">GCE Kalahandi</span>
                </div>
              </div>

              <Link 
                href={`/member/${member.memberId}`}
                className="mt-6 block w-full bg-[#B1122B] hover:bg-[#6E1020] text-white font-medium py-3 rounded-lg transition-colors"
              >
                View Full Profile →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-red-500 tracking-wide">INVALID ID</h2>
              <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6">
                <p className="text-gray-300">
                  This ID is not registered, has been deactivated, or belongs to a suspended user.
                </p>
                <p className="text-xs text-red-400 font-mono mt-4">
                  ID: {params.memberId}
                </p>
              </div>
              <Link 
                href="/"
                className="mt-6 block w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition-colors border border-gray-800"
              >
                Go to Homepage
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
