"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Resource } from "@/lib/types"
import { Plus, Search, Edit, Trash2, FileText, Eye } from "lucide-react"

export function ResourceManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

  // Mock resources data
  const [resources] = useState<Resource[]>([
    {
      id: "1",
      title: "Managing Academic Stress: A Student's Guide",
      type: "article",
      content: "Comprehensive guide on managing academic stress...",
      summary: "A comprehensive guide to understanding and managing academic stress with practical strategies.",
      tags: ["Academic Stress", "Study Tips", "Self-Care"],
      author: "Dr. Sarah Johnson",
      publishedAt: new Date("2024-01-15"),
      readTime: 8,
    },
    {
      id: "2",
      title: "Understanding Anxiety: Symptoms and Coping Strategies",
      type: "article",
      content: "Detailed article about anxiety and coping mechanisms...",
      summary: "Learn about anxiety symptoms, types, and evidence-based coping strategies.",
      tags: ["Anxiety", "Mental Health", "Coping Strategies"],
      author: "Dr. Michael Chen",
      publishedAt: new Date("2024-02-01"),
      readTime: 10,
    },
    {
      id: "3",
      title: "Building Resilience: Bouncing Back from Challenges",
      type: "blog",
      content: "Blog post about building resilience...",
      summary: "Discover how to build resilience and develop skills to bounce back from challenges.",
      tags: ["Resilience", "Personal Growth", "Mental Strength"],
      author: "Dr. Emily Rodriguez",
      publishedAt: new Date("2024-01-28"),
      readTime: 7,
    },
  ])

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === "all" || resource.type === filterType
    return matchesSearch && matchesType
  })

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      article: "bg-blue-100 text-blue-800",
      blog: "bg-green-100 text-green-800",
      video: "bg-purple-100 text-purple-800",
      guide: "bg-orange-100 text-orange-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resource Management
              </CardTitle>
              <CardDescription>Manage educational resources and materials</CardDescription>
            </div>
            <Dialog open={isAddResourceOpen} onOpenChange={setIsAddResourceOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Resource</DialogTitle>
                  <DialogDescription>Create a new educational resource for students</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Enter resource title" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="blog">Blog Post</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="guide">Guide</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="author">Author</Label>
                      <Input id="author" placeholder="Author name" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea id="summary" placeholder="Brief summary of the resource" rows={2} />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" placeholder="Full content of the resource" rows={8} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input id="tags" placeholder="anxiety, stress, coping" />
                    </div>
                    <div>
                      <Label htmlFor="readTime">Read Time (minutes)</Label>
                      <Input id="readTime" type="number" placeholder="5" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddResourceOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddResourceOpen(false)}>Add Resource</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="article">Articles</SelectItem>
                <SelectItem value="blog">Blog Posts</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="guide">Guides</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resources ({filteredResources.length})</CardTitle>
          <CardDescription>Educational materials available to students</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Read Time</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium max-w-xs">
                    <div className="truncate">{resource.title}</div>
                    <div className="text-sm text-gray-500 truncate">{resource.summary}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                      {resource.type}
                    </span>
                  </TableCell>
                  <TableCell>{resource.author}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{resource.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{resource.readTime} min</TableCell>
                  <TableCell>{new Date(resource.publishedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedResource(resource)}>
                        <Eye className="h-4 w-4" />
                      </Button>
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

      {/* Resource Preview Dialog */}
      {selectedResource && (
        <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{selectedResource.title}</DialogTitle>
              <DialogDescription>
                By {selectedResource.author} • {selectedResource.readTime} min read
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="prose max-w-none">
                <p className="text-gray-700">{selectedResource.content}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex flex-wrap gap-1">
                {selectedResource.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button onClick={() => setSelectedResource(null)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
