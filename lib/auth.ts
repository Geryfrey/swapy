import type { User } from "./types"

// Simulated user database
const users: User[] = [
  {
    id: "1",
    registrationNumber: "220014748",
    email: "student@university.edu",
    name: "John Doe",
    role: "student",
    createdAt: new Date(),
  },
  {
    id: "2",
    email: "admin@university.edu",
    name: "Admin User",
    role: "admin",
    createdAt: new Date(),
  },
  {
    id: "3",
    email: "superadmin@university.edu",
    name: "Super Admin",
    role: "super_admin",
    createdAt: new Date(),
  },
]

export function validateRegistrationNumber(regNumber: string): boolean {
  return /^2\d{8}$/.test(regNumber)
}

export function authenticateStudent(registrationNumber: string): User | null {
  if (!validateRegistrationNumber(registrationNumber)) {
    return null
  }
  return users.find((u) => u.registrationNumber === registrationNumber) || null
}

export function authenticateUser(email: string, password: string): User | null {
  // Simplified authentication - in real app, verify password hash
  return users.find((u) => u.email === email) || null
}
