import { supabase } from "./supabase/client"
import type { User } from "./types"

export async function signUp(email: string, password: string, fullName: string, role = "student") {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error

  if (data.user) {
    // Create user profile
    const { error: profileError } = await supabase.from("users").insert({
      id: data.user.id,
      email,
      full_name: fullName,
      role,
    })

    if (profileError) throw profileError

    // If student, create student profile
    if (role === "student") {
      const { error: studentError } = await supabase.from("students").insert({
        user_id: data.user.id,
      })

      if (studentError) throw studentError
    }
  }

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  return profile
}
