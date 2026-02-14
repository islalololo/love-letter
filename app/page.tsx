"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [letters, setLetters] = useState<any[]>([])
  const [content, setContent] = useState("")
  const [user, setUser] = useState<any>(null)

  // 1️⃣ 로그인 세션 가져오기
useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  getUser()
}, [])

// 2️⃣ user 생기면 letters polling
useEffect(() => {
  if (!user) return

  const fetchLetters = async () => {
    const { data: lettersData } = await supabase
      .from("letters")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    setLetters(lettersData || [])
  }

  fetchLetters()

  const interval = setInterval(fetchLetters, 3000)

  return () => clearInterval(interval)
}, [user])



  const submitLetter = async () => {
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      alert("Please login first.")
      return
    }

    const { data: insertedLetter, error } = await supabase
      .from("letters")
      .insert({
        user_id: data.user.id,
        content,
        price: 1500
      })
      .select()
      .single()

    if (error) {
      alert("Error saving letter.")
      return
    }

    setLetters((prev) => [insertedLetter, ...prev])
    setContent("")
  }


return (
  <>
    {/* NOISE OVERLAY */}
    <div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: "url('/oldfilmgrain.png')",
    backgroundRepeat: "repeat",
    backgroundSize: "1100px",
    opacity: 0.3,
    pointerEvents: "none",
    zIndex: 9999
  }}
/>


    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        color: "black",
        padding: "80px 120px",
        fontFamily: "var(--font-cormorant)",
        position: "relative",
        zIndex: 1
      }}
    >
      {/* LOGIN */}
      {user ? (
  <div
    style={{
      position: "absolute",
      top: 40,
      right: 120,
      fontSize: 14,
      display: "flex",
      gap: "20px",
      alignItems: "center"
    }}
  >
    <span>{user.email}</span>

    <button
      onClick={async () => {
        await supabase.auth.signOut()
        window.location.reload()
      }}
      style={{
        background: "none",
        border: "none",
        fontFamily: "var(--font-playfair)",
        cursor: "pointer",
        transition: "opacity 0.3s ease"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.5")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      LOG OUT
    </button>
  </div>
) : (
  <a
    href="/login"
    style={{
      position: "absolute",
      top: 40,
      right: 120,
      fontSize: 14
    }}
  >
    LOGIN
  </a>
)}


      {/* TITLE */}
      <h1
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "56px",
          letterSpacing: "3px",
          marginBottom: "10px"
        }}
      >
        LETTER ARCHIVE
      </h1>

      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "black",
          marginBottom: "40px"
        }}
      />

      <p
        style={{
          fontSize: "12px",
          letterSpacing: "4px",
          marginBottom: "80px",
          opacity: 0.6
        }}
      >
        PRIVATE CORRESPONDENCE / ISSUE 01 / 2026
      </p>

      {/* GRID LAYOUT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "100px"
        }}
      >
        {/* LEFT COLUMN */}
        <div
          style={{
            borderRight: "1px solid black",
            paddingRight: "60px"
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "26px",
              marginBottom: "30px"
            }}
          >
            YOUR LETTER
          </h2>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your private correspondence..."
            style={{
              width: "100%",
              height: "300px",
              border: "none",
              outline: "none",
              borderBottom: "1px solid black",
              background: "transparent",
              fontSize: "18px",
              lineHeight: "2",
              letterSpacing: "0.5px",
              resize: "none"
            }}
          />

          <button
  onClick={submitLetter}
  style={{
    marginTop: "30px",
    background: "none",
    border: "none",
    fontFamily: "var(--font-playfair)",
    fontSize: "16px",
    letterSpacing: "2px",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.3s ease"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.letterSpacing = "4px"
    e.currentTarget.style.opacity = "0.6"
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.letterSpacing = "2px"
    e.currentTarget.style.opacity = "1"
  }}
>
  SUBMIT —
</button>

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ paddingLeft: "60px" }}>
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "26px",
              marginBottom: "30px"
            }}
          >
            RESPONSE
          </h2>

          {letters.length === 0 ? (
            <p style={{ opacity: 0.5 }}>No archived letters.</p>
          ) : (
            letters.map((letter) => (
              <div key={letter.id} style={{ 
                marginBottom: "60px"
               }}>
                <p
                  style={{
                    fontSize: "18px",
                    lineHeight: "2",
                    letterSpacing: "0.5px",
                    marginBottom: "20px"
                  }}
                >
                  {letter.content}
                </p>

                {letter.answer ? (
                  <p
                    style={{
                      fontSize: "18px",
                      lineHeight: "2",
                      letterSpacing: "0.5px"
                    }}
                  >
                    {letter.answer}
                  </p>
                ) : (
                  <p style={{ opacity: 0.4 }}>
                    Awaiting editorial response...
                  </p>
                )}

                <div
                  style={{
                    marginTop: "40px",
                    height: "1px",
                    backgroundColor: "black"
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  </>
)}
