"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createMember } from "@/lib/actions/member.actions"
import { Role } from "@prisma/client"
import { Upload, ArrowLeft, X } from "lucide-react"
import Link from "next/link"

import { IDCard } from "@/components/id-card/IDCard"
import { toPng } from "html-to-image"

export default function AddMemberPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  // New state to hold member for hidden rendering
  const [createdMemberToCapture, setCreatedMemberToCapture] = useState<any>(null)

  const [formData, setFormData] = useState({
    fullName: "",
    role: Role.COORDINATOR,
    branch: "",
    year: "",
    email: "",
    phone: "",
    bio: "",
    profileImage: "",
  })

  // ... (keep handleChange, handleImageUpload, clearImage) ...
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 800
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width)
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height)
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)

        const compressedBase64 = canvas.toDataURL("image/webp", 0.7)
        
        setPreviewImage(compressedBase64)
        setFormData(prev => ({ ...prev, profileImage: compressedBase64 }))
        setError("")
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setPreviewImage(null)
    setFormData(prev => ({ ...prev, profileImage: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    // 1. Create the member in DB
    const result = await createMember(formData)
    
    if (result.success && result.member) {
      // 2. We set the created member to state, which renders the hidden IDCard
      setCreatedMemberToCapture(result.member)
      
      // We need to wait for React to render the hidden card, and for QR to generate
      setTimeout(async () => {
        try {
          const node = document.getElementById('hidden-id-card-element')
          if (node) {
            const dataUrl = await toPng(node, { quality: 1, pixelRatio: 2 })
            
            // 3. Send the generated PNG back to server to save in public/generated-ids
            await fetch('/api/save-id-card', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                memberId: result.member.memberId,
                base64: dataUrl
              })
            })
          }
        } catch (err) {
          console.error("Failed to capture and save ID card auto", err)
        }
        
        // 4. Finally redirect
        router.push("/admin/members")
      }, 1500) // 1.5s wait to ensure QR code resolves and image loads
    } else {
      setError(result.error || "Failed to create member")
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      {/* HIDDEN ID CARD FOR CAPTURING */}
      {createdMemberToCapture && (
        <div className="absolute top-0 left-[-9999px] z-[-999]">
          <div id="hidden-id-card-element">
            <IDCard member={createdMemberToCapture} />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Link href="/admin/members" className="p-2 bg-gray-900 rounded-md hover:bg-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Member</h1>
          <p className="text-gray-400">Register a new team member to generate their ID and QR.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/50 border border-red-900 text-red-200 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-gray-900 rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Full Name *</label>
                <input 
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-800 rounded-md px-4 py-2 text-white focus:border-[#B1122B] focus:outline-none" 
                  placeholder="e.g. Deepankar Kumar"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Role *</label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-800 rounded-md px-4 py-2 text-white focus:border-[#B1122B] focus:outline-none"
                >
                  <option value={Role.CHIEF_COORDINATOR}>Chief Coordinator</option>
                  <option value={Role.COORDINATOR}>Coordinator</option>
                  <option value={Role.VOLUNTEER}>Volunteer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Branch *</label>
                <select 
                  required
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-800 rounded-md px-4 py-2 text-white focus:border-[#B1122B] focus:outline-none"
                >
                  <option value="">Select Branch</option>
                  <option value="Computer Science Engineering">CSE</option>
                  <option value="Mechanical Engineering">Mechanical</option>
                  <option value="Civil Engineering">Civil</option>
                  <option value="Electrical Engineering">Electrical</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Year</label>
                <select 
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-800 rounded-md px-4 py-2 text-white focus:border-[#B1122B] focus:outline-none"
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email Address</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-800 rounded-md px-4 py-2 text-white focus:border-[#B1122B] focus:outline-none" 
                  placeholder="example@mail.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Phone Number</label>
                <input 
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-800 rounded-md px-4 py-2 text-white focus:border-[#B1122B] focus:outline-none" 
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Bio / Short Introduction</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full bg-black border border-gray-800 rounded-md px-4 py-2 text-white focus:border-[#B1122B] focus:outline-none resize-none" 
                placeholder="A passionate learner, builder and team player..."
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-900">
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-6 py-2 bg-[#B1122B] hover:bg-[#6E1020] text-white font-medium rounded-md transition-colors disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create Member"}
              </button>
            </div>
          </form>
        </div>

        {/* Profile Photo Upload & Preview */}
        <div className="space-y-6">
          <div className="bg-[#0A0A0A] border border-gray-900 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Profile Photo</h3>
            
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/webp" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />

            {previewImage ? (
              <div className="relative border border-gray-800 rounded-xl overflow-hidden aspect-square bg-black">
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-900/80 text-white rounded-full transition-colors backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-600 transition-colors aspect-square bg-black/50"
              >
                <Upload className="w-8 h-8 text-gray-500 mb-3" />
                <p className="text-sm font-medium text-white mb-1">Upload Photo</p>
                <p className="text-xs text-gray-500">PNG, JPG (Max 5MB)</p>
              </div>
            )}
          </div>

          <div className="bg-[#0A0A0A] border border-gray-900 rounded-xl p-6">
             <h3 className="text-sm font-medium text-gray-300 mb-4">ID Preview</h3>
             <div className="bg-black border border-gray-800 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Generated ID will be:</p>
                <p className="text-lg font-mono font-bold text-[#B1122B]">
                  {formData.role === 'CHIEF_COORDINATOR' ? 'INS26-CC-***' : 
                   formData.role === 'COORDINATOR' ? 'INS26-CO-***' : 'INS26-VO-***'}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
