"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { User, MentalHealthCenter } from "@/lib/types"
import { Plus, Search, Edit, Trash2, Users, Building2 } from "lucide-react"

export function UserManagement() {
  const [activeTab, setActiveTab] = useState<"students" | "centers">("students")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isAddCenterOpen, setIsAddCenterOpen] = useState(false)

  // Mock data for students
  const [students] = useState<User[]>([
    {
      id: "1",
      registrationNumber: "220014748",
      email: "john.doe@university.edu",
      name: "John Doe",
      role: "student",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      registrationNumber: "220015892",
      email: "sarah.smith@university.edu",
      name: "Sarah Smith",
      role: "student",
      createdAt: new Date("2024-01-20"),
    },
    {
      id: "3",
      registrationNumber: "220016743",
      email: "mike.johnson@university.edu",
      name: "Mike Johnson",
      role: "student",
      createdAt: new Date("2024-02-01"),
    },
  ])

  // Mock data for mental health centers
  const [centers] = useState<MentalHealthCenter[]>([
    {
      id: "1",
      name: "University Counseling Center",
      address: "123 Campus Drive, University City",
      phone: "+1-555-0123",
      email: "counseling@university.edu",
      specialties: ["Anxiety", "Depression", "Academic Stress"],
      availability: "Mon-Fri 9AM-5PM",
      rating: 4.8,
    },
    {
      id: "2",
      name: "Mental Health First Aid Clinic",
      address: "456 Health Street, Medical District",
      phone: "+1-555-0456",
      email: "info@mhfaclinic.com",
      specialties: ["Crisis Intervention", "Trauma", "Substance Abuse"],
      availability: "24/7 Emergency Services",
      rating: 4.6,
    },
  ])

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registrationNumber?.includes(searchTerm),
  )

  const filteredCenters = centers.filter(
    (center) =>
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User & Resource Management</CardTitle>
              <CardDescription>Manage students and mental health centers</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === "students" ? "default" : "outline"}
                onClick={() => setActiveTab("students")}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Students
              </Button>
              <Button
                variant={activeTab === "centers" ? "default" : "outline"}
                onClick={() => setActiveTab("centers")}
                className="flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                Centers
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Add */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {activeTab === "students" ? (
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>Register a new student in the system</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter student name" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="student@university.edu" />
                    </div>
                    <div>
                      <Label htmlFor="regNumber">Registration Number</Label>
                      <Input id="regNumber" placeholder="220000000" maxLength={9} />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddUserOpen(false)}>Add Student</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={isAddCenterOpen} onOpenChange={setIsAddCenterOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Center
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Mental Health Center</DialogTitle>
                    <DialogDescription>Register a new mental health center</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="centerName">Center Name</Label>
                        <Input id="centerName" placeholder="Enter center name" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="+1-555-0000" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="Enter full address" />
                    </div>
                    <div>
                      <Label htmlFor="centerEmail">Email</Label>
                      <Input id="centerEmail" type="email" placeholder="contact@center.com" />
                    </div>
                    <div>
                      <Label htmlFor="availability">Availability</Label>
                      <Input id="availability" placeholder="Mon-Fri 9AM-5PM" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddCenterOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddCenterOpen(false)}>Add Center</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {activeTab === "students" ? (
        <Card>
          <CardHeader>
            <CardTitle>Students ({filteredStudents.length})</CardTitle>
            <CardDescription>Manage registered students</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Registration Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.registrationNumber}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{new Date(student.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Mental Health Centers ({filteredCenters.length})</CardTitle>
            <CardDescription>Manage mental health service providers</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Specialties</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCenters.map((center) => (
                  <TableRow key={center.id}>
                    <TableCell className="font-medium">{center.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{center.address}</TableCell>
                    <TableCell>{center.phone}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {center.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {center.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{center.specialties.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{center.rating}/5</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
