import Link from "next/link"
import { ArrowRight, QrCode } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      {/* Nav */}
      <nav className="p-6 border-b border-gray-900 flex justify-between items-center max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#B1122B] to-red-900 rounded-md flex items-center justify-center font-bold">1</div>
          <span className="text-xl font-bold tracking-wider">
            INSPRANO <span className="text-[#B1122B]">2K26</span>
          </span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
          <Link href="/" className="text-white">Home</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/events" className="hover:text-white transition-colors">Events</Link>
          <Link href="/team" className="hover:text-white transition-colors">Team</Link>
        </div>
        <Link 
          href="/admin" 
          className="bg-gray-900 hover:bg-gray-800 border border-gray-700 px-4 py-2 rounded-md text-sm transition-colors"
        >
          Verify ID
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6 text-center overflow-hidden py-24">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B1122B] rounded-full blur-[150px] opacity-20 pointer-events-none" />
        
        <div className="z-10 max-w-4xl space-y-8">
          <div className="inline-block px-4 py-1.5 bg-[#B1122B]/10 border border-[#B1122B]/30 rounded-full text-[#B1122B] text-xs font-bold tracking-widest uppercase mb-4">
            IDEAS • PEOPLE • POSSIBILITIES
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            INSPRANO <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B1122B] via-red-600 to-[#6E1020]">
              2K26
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 font-light tracking-widest uppercase">
            A Bolder Tomorrow
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto mt-6">
            The annual techfest of Government College of Engineering, Kalahandi. 
            Experience technology, innovation, and creativity like never before.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href="/team" 
              className="flex items-center gap-2 bg-[#B1122B] hover:bg-[#6E1020] text-white px-8 py-4 rounded-md transition-all text-sm font-bold tracking-wider hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
            >
              Explore Team <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/admin" 
              className="flex items-center gap-2 bg-transparent border border-gray-700 hover:border-white text-white px-8 py-4 rounded-md transition-all text-sm font-bold tracking-wider hover:bg-white/5 w-full sm:w-auto justify-center"
            >
              <QrCode className="w-4 h-4" /> Verify ID
            </Link>
          </div>
        </div>
      </main>

      {/* Stats Bar */}
      <div className="border-y border-gray-900 bg-black/50 z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-900">
          {[
            { value: "50+", label: "Events" },
            { value: "500+", label: "Participants" },
            { value: "100+", label: "Team Members" },
            { value: "∞", label: "Possibilities" },
          ].map((stat, i) => (
            <div key={i} className="py-8 text-center flex flex-col items-center justify-center hover:bg-gray-900/50 transition-colors cursor-default">
              <span className="text-3xl font-bold text-white mb-1">{stat.value}</span>
              <span className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
