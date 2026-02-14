"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Admin() {
  const [letters, setLetters] = useState<any[]>([])

  useEffect(() => {
    const fetchLetters = async () => {
      const { data } = await supabase
        .from("letters")
        .select("*")
        .order("created_at", { ascending: false })

      setLetters(data || [])
    }

    fetchLetters()
  }, [])

  const updateAnswer = async (id: string, answer: string) => {
  console.log("Updating id:", id)
  console.log("Answer:", answer)

  const { data, error } = await supabase
    .from("letters")
    .update({
      answer: answer,
      status: "answered"
    })
    .eq("id", id)
    .select()

  console.log("Result:", data)
  console.log("Error:", error)

  if (error) {
    alert("Error saving answer.")
  } else {
    alert("Answer saved.")
  }
}


  return (
    <main style={{ padding: 40 }}>
      <h1>Admin Panel</h1>

      {letters.map((letter) => (
        <div key={letter.id} style={{ marginBottom: 40 }}>
          <p><strong>Question:</strong> {letter.content}</p>

          <textarea
            placeholder="Write answer..."
            defaultValue={letter.answer || ""}
            onBlur={(e) =>
              updateAnswer(letter.id, e.target.value)
            }
            style={{ width: "100%", height: 100 }}
          />

          <hr />
        </div>
      ))}
    </main>
  )
}
