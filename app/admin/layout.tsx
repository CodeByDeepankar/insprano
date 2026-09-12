import { redirect } from "next/navigation"
import { auth } from "@/auth"
import Link from "next/link"
import { LayoutDashboard, Users, UserPlus, FileEdit, QrCode, CreditCard, Settings, LogOut } from "lucide-react"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex bg-[#050505] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-gray-900 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-900">
          <h2 className="text-xl font-bold tracking-wider">INSPRANO <span className="text-[#B1122B]">2K26</span></h2>
          <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-900 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-gray-400" />
            <span>Dashboard</span>
          </Link>
          
          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Team Management
          </div>
          <Link href="/admin/members" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-900 transition-colors">
            <Users className="w-5 h-5 text-gray-400" />
            <span>All Members</span>
          </Link>
          <Link href="/admin/members/new" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-900 transition-colors">
            <UserPlus className="w-5 h-5 text-gray-400" />
            <span>Add Member</span>
          </Link>
          
          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Tools
          </div>
          <Link href="/admin/id-cards" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-900 transition-colors">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <span>ID Cards</span>
          </Link>
          <Link href="/admin/qr-codes" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-900 transition-colors">
            <QrCode className="w-5 h-5 text-gray-400" />
            <span>QR Codes</span>
          </Link>
          <Link href="/admin/works" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-900 transition-colors">
            <FileEdit className="w-5 h-5 text-gray-400" />
            <span>Works & Events</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-900">
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-900 transition-colors mb-2">
            <Settings className="w-5 h-5 text-gray-400" />
            <span>Settings</span>
          </Link>
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-950 text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-[#0A0A0A] border-b border-gray-900 p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">INSPRANO <span className="text-[#B1122B]">2K26</span></h2>
          {/* Mobile menu button would go here */}
        </header>
        
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
