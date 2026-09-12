"use client"

import { useState, useEffect } from "react"
import { IDCard } from "@/components/id-card/IDCard"
import { toPng } from "html-to-image"
import jsPDF from "jspdf"
import { Download, Search, Image as ImageIcon, FileText } from "lucide-react"

export default function IDCardsPage() {
  const [members, setMembers] = useState<any[]>([])
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, you'd create a server action or API route to fetch members for this client component.
    // Here we'll simulate fetching from a new API route we'll create.
    fetch('/api/members')
      .then(res => res.json())
      .then(data => {
        setMembers(data.members || [])
        if (data.members?.length > 0) {
          setSelectedMember(data.members[0])
        }
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch members", err)
        setIsLoading(false)
      })
  }, [])

  const filteredMembers = members.filter(m => 
    m.fullName.toLowerCase().includes(search.toLowerCase()) || 
    m.memberId.toLowerCase().includes(search.toLowerCase())
  )

  const downloadPNG = async () => {
    const node = document.getElementById('id-card-element')
    if (!node) return
    
    try {
      const dataUrl = await toPng(node, { 
        quality: 1, 
        pixelRatio: 2, // High resolution
      })
      const link = document.createElement('a')
      link.download = `${selectedMember.memberId}-ID.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to generate PNG', err)
    }
  }

  const downloadPDF = async () => {
    const node = document.getElementById('id-card-element')
    if (!node) return
    
    try {
      const dataUrl = await toPng(node, { quality: 1, pixelRatio: 2 })
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [2.125, 3.375] // Standard ID card size
      })
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, 2.125, 3.375)
      pdf.save(`${selectedMember.memberId}-ID.pdf`)
    } catch (err) {
      console.error('Failed to generate PDF', err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ID Card Generator</h1>
        <p className="text-gray-400 mt-1">Preview and download digital ID cards for team members.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar - Members List */}
        <div className="bg-[#0A0A0A] border border-gray-900 rounded-xl overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-900">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search member..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-md pl-10 pr-4 py-2 text-sm text-white focus:border-[#B1122B] focus:outline-none"
              />
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading members...</div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No members found.</div>
            ) : (
              filteredMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex flex-col ${
                    selectedMember?.id === member.id 
                      ? 'bg-[#B1122B]/20 border border-[#B1122B]/50' 
                      : 'hover:bg-gray-900 border border-transparent'
                  }`}
                >
                  <span className="font-medium text-sm text-white">{member.fullName}</span>
                  <div className="flex justify-between items-center w-full mt-1">
                    <span className="text-xs text-gray-400 font-mono">{member.memberId}</span>
                    <span className="text-[10px] uppercase text-[#B1122B]">{member.role.replace('_', ' ')}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right side - Preview & Export */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0A0A0A] border border-gray-900 rounded-xl p-6 flex flex-col items-center justify-center min-h-[600px]">
            {selectedMember ? (
              <>
                <div className="w-full flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">ID Card Preview</h2>
                  <div className="flex gap-3">
                    <button 
                      onClick={downloadPNG}
                      className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium border border-gray-800"
                    >
                      <ImageIcon className="w-4 h-4" />
                      PNG
                    </button>
                    <button 
                      onClick={downloadPDF}
                      className="flex items-center gap-2 bg-[#B1122B] hover:bg-[#6E1020] text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      PDF
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center overflow-auto w-full py-8">
                  {/* Scale wrapper to fit preview in smaller screens */}
                  <div className="scale-75 sm:scale-90 md:scale-100 origin-top">
                    <IDCard member={selectedMember} />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                <p>Select a member from the list to preview their ID card.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
