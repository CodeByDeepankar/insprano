"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })
      
      if (res?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/admin")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0A0A0A] border border-red-900/30 p-8 rounded-xl shadow-2xl shadow-red-900/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">INSPRANO <span className="text-[#B1122B]">2K26</span></h1>
          <p className="text-gray-400">Admin Portal Login</p>
        </div>
        
        {error && (
          <div className="bg-red-950/50 border border-red-900 text-red-200 p-3 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#B1122B] transition-colors"
              placeholder="admin@insprano.in"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#B1122B] transition-colors"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B1122B] hover:bg-[#6E1020] text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  )
}
