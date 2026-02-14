"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:3000"
      }
    })

    if (error) {
      alert("Error sending login link.")
    } else {
      alert("Check your email for login link!")
    }
  }

  return (
    <div style={{ padding: 60 }}>
      <h1>Login</h1>
      <input
        style={{ padding: 10, width: 300 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
      />
      <br /><br />
      <button onClick={handleLogin}>
        Send Login Link
      </button>
    </div>
  )
}
