"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"

interface IDCardProps {
  member: {
    fullName: string
    memberId: string
    role: string
    branch: string
    profileImage?: string | null
  }
}

export function IDCard({ member }: IDCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  useEffect(() => {
    // Generate QR Code pointing to the verification page
    const verifyUrl = `${window.location.origin}/verify/${member.memberId}`
    
    QRCode.toDataURL(verifyUrl, {
      width: 256,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error("Error generating QR code", err))
  }, [member.memberId])

  const backgroundImages: Record<string, string> = {
    CHIEF_COORDINATOR: '/id-bg-chief.png',
    COORDINATOR: '/coordinator.png',
    VOLUNTEER: '/volunteer.png',
  }
  const isVolunteer = member.role === 'VOLUNTEER'
  const canShowProfileImage = member.role === 'CHIEF_COORDINATOR' || member.role === 'COORDINATOR'
  const bgImage = backgroundImages[member.role] || '/id-bg-chief.png'

  return (
    <div 
      id="id-card-element"
      className="relative w-[638px] h-[1013px] bg-black overflow-hidden flex flex-col font-sans"
    >
      <img 
        src={bgImage} 
        alt="ID Background" 
        className="absolute inset-0 w-full h-full object-fill z-0"
      />

      {canShowProfileImage && member.profileImage && (
        <div className="absolute inset-0 z-10 flex justify-center pointer-events-none pt-[290px]">
          <img
            src={member.profileImage}
            alt={member.fullName}
            crossOrigin="anonymous"
            className="w-[250px] h-[250px] rounded-full object-cover object-top border-4 border-[#B1122B]"
          />
        </div>
      )}

      {/* Text and QR Layer */}
      <div className="absolute inset-0 z-20 flex flex-col items-center pointer-events-none">
        
        {/* Name */}
        <div className={`absolute ${isVolunteer ? 'top-[520px]' : 'top-[590px]'} w-full text-center px-4 flex justify-center`}>
          <h2 className="text-[32px] font-bold text-white uppercase tracking-wider font-sans whitespace-nowrap" style={{ textShadow: '0 4px 10px rgba(0,0,0,1)' }}>
            {member.fullName}
          </h2>
        </div>

        {/* Branch */}
        <div className={`absolute ${isVolunteer ? 'top-[575px]' : 'top-[650px]'} w-full text-center px-4`}>
          <p className="text-[18px] font-semibold text-white uppercase tracking-[0.12em]" style={{ textShadow: '0 3px 8px rgba(0,0,0,1)' }}>
            {member.branch}
          </p>
        </div>
        
        {/* QR Code and Member ID */}
        <div className="absolute top-[785px] w-full flex flex-col items-center">
          <div className="bg-white p-[6px] rounded-md shadow-2xl">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR Code" className="w-[120px] h-[120px]" />
            ) : (
              <div className="w-[120px] h-[120px] bg-gray-200 animate-pulse" />
            )}
          </div>
          <p className="mt-3 text-[16px] font-mono font-bold text-white tracking-[0.15em] opacity-80">
            ID: {member.memberId}
          </p>
        </div>
      </div>
    </div>
  )
}
