"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Resource } from "@/lib/types"
import { Clock, User, X } from "lucide-react"

interface ResourceViewerProps {
  resource: Resource
  onClose: () => void
}

export function ResourceViewer({ resource, onClose }: ResourceViewerProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl mb-2">{resource.title}</DialogTitle>
              <DialogDescription className="text-base">{resource.summary}</DialogDescription>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  {resource.author}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  {resource.readTime} min read
                </div>
                <Badge variant="outline">{resource.type}</Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{resource.content}</div>
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex flex-wrap gap-1">
            {resource.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="text-sm text-gray-500">Published {new Date(resource.publishedAt).toLocaleDateString()}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
