"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { User, JournalEntry } from "@/lib/types"
import { PenTool, Calendar, Tag, Search, Plus } from "lucide-react"

interface JournalTabProps {
  user: User
}

export function JournalTab({ user }: JournalTabProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMood, setSelectedMood] = useState<string>("All moods")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: "",
    tags: [] as string[],
  })

  // Load sample journal entries
  useEffect(() => {
    const sampleEntries: JournalEntry[] = [
      {
        id: "1",
        studentId: user.id,
        title: "Feeling Overwhelmed with Midterms",
        content: `Today was particularly challenging. I have three midterm exams coming up next week and I'm feeling really overwhelmed. The amount of material I need to review seems impossible to cover in time.

I spent most of the day in the library, but I kept getting distracted by my phone and social media. I know I need to find better ways to focus and manage my time.

On the positive side, I did manage to complete my chemistry lab report, which was due tomorrow. Small wins, I guess.

I think I need to:
- Create a more structured study schedule
- Find a study group for my hardest subjects
- Maybe talk to the counseling center about stress management techniques

Tomorrow I'll try to wake up earlier and start with my most difficult subject when my mind is fresh.`,
        mood: "Stressed",
        tags: ["midterms", "stress", "studying", "time-management"],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "2",
        studentId: user.id,
        title: "Good Day at the Gym",
        content: `Had a really good workout today! I've been trying to maintain a regular exercise routine to help with my stress levels, and it's definitely paying off.

I did 30 minutes on the treadmill and then some weight training. I felt so much better afterward - like all the tension from the week just melted away.

I also met a new friend at the gym, Sarah, who's in my psychology class. We're planning to study together for the upcoming exam. It's nice to have someone to share the academic load with.

Exercise really does help with my anxiety. I should remember this feeling the next time I don't want to go to the gym.`,
        mood: "Happy",
        tags: ["exercise", "gym", "stress-relief", "friendship"],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "3",
        studentId: user.id,
        title: "Homesickness",
        content: `Called home today and talked to my parents for over an hour. I've been feeling really homesick lately, especially with the holidays coming up.

Being away from family for the first time is harder than I expected. I miss my mom's cooking, family dinners, and just the comfort of being around people who know me so well.

My roommate noticed I've been quieter than usual and asked if I was okay. It was nice that she cared enough to check in. I opened up a bit about missing home, and she shared that she went through the same thing her first year.

I'm thinking about joining some clubs or activities to build more connections here. Maybe the hiking club or the volunteer organization I've been considering.

It's normal to feel this way, right? I know it will get better with time.`,
        mood: "Sad",
        tags: ["homesickness", "family", "adjustment", "loneliness"],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "4",
        studentId: user.id,
        title: "Great Presentation Today",
        content: `I absolutely nailed my presentation in my public speaking class today! I was so nervous beforehand - my hands were shaking and I could barely eat breakfast.

But once I got up there and started talking about my topic (sustainable energy solutions), everything just flowed naturally. I had practiced so many times in front of the mirror, and all that preparation really paid off.

The professor gave me excellent feedback and said my research was thorough and well-presented. A few classmates even came up to me afterward to ask questions and compliment my presentation.

This is such a confidence boost! I've always been terrified of public speaking, but today proved to me that I can do it. I'm actually looking forward to the next presentation assignment.

I think the key was choosing a topic I'm genuinely passionate about. When you care about what you're saying, it's easier to connect with your audience.`,
        mood: "Excited",
        tags: ["presentation", "public-speaking", "confidence", "success"],
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: "5",
        studentId: user.id,
        title: "Struggling with Sleep",
        content: `Another night of tossing and turning. I've been having trouble sleeping for the past week, and it's starting to affect everything else.

I lie in bed thinking about all the assignments I have due, the exams coming up, and whether I'm making the right choices with my major. My mind just won't shut off.

I tried some of the relaxation techniques I learned in my wellness class - deep breathing, progressive muscle relaxation - but they only help a little. Maybe I need to be more consistent with them.

I've also been drinking too much coffee during the day, which probably isn't helping. And I know I shouldn't be looking at my phone right before bed, but it's become such a habit.

Tomorrow I'm going to try:
- No caffeine after 2 PM
- Put my phone in another room at bedtime
- Try reading a book instead of scrolling social media
- Maybe some chamomile tea before bed

I really need to get this under control. Everything feels harder when I'm tired.`,
        mood: "Tired",
        tags: ["sleep", "insomnia", "anxiety", "self-care"],
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
    ]
    setEntries(sampleEntries)
  }, [user.id])

  const moods = ["Happy", "Sad", "Excited", "Anxious", "Stressed", "Calm", "Tired", "Motivated"]
  const commonTags = ["stress", "studying", "friends", "family", "exercise", "sleep", "anxiety", "goals"]

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMood = selectedMood === "All moods" || entry.mood === selectedMood
    return matchesSearch && matchesMood
  })

  const handleSaveEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return

    const entry: JournalEntry = {
      id: Date.now().toString(),
      studentId: user.id,
      title: newEntry.title,
      content: newEntry.content,
      mood: newEntry.mood,
      tags: newEntry.tags,
      createdAt: new Date(),
    }

    setEntries([entry, ...entries])
    setNewEntry({ title: "", content: "", mood: "", tags: [] })
    setIsDialogOpen(false)
  }

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      Happy: "bg-green-100 text-green-800",
      Excited: "bg-yellow-100 text-yellow-800",
      Calm: "bg-blue-100 text-blue-800",
      Motivated: "bg-purple-100 text-purple-800",
      Sad: "bg-gray-100 text-gray-800",
      Anxious: "bg-orange-100 text-orange-800",
      Stressed: "bg-red-100 text-red-800",
      Tired: "bg-indigo-100 text-indigo-800",
    }
    return colors[mood] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5" />
                Personal Journal
              </CardTitle>
              <CardDescription>Track your thoughts, feelings, and daily experiences</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Journal Entry</DialogTitle>
                  <DialogDescription>Write about your day, thoughts, or feelings</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newEntry.title}
                      onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                      placeholder="Give your entry a title..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="mood">Mood</Label>
                    <Select value={newEntry.mood} onValueChange={(value) => setNewEntry({ ...newEntry, mood: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="How are you feeling?" />
                      </SelectTrigger>
                      <SelectContent>
                        {moods.map((mood) => (
                          <SelectItem key={mood} value={mood}>
                            {mood}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newEntry.content}
                      onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                      placeholder="Write your thoughts here..."
                      rows={8}
                    />
                  </div>
                  <div>
                    <Label>Tags (optional)</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {commonTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={newEntry.tags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            if (newEntry.tags.includes(tag)) {
                              setNewEntry({ ...newEntry, tags: newEntry.tags.filter((t) => t !== tag) })
                            } else {
                              setNewEntry({ ...newEntry, tags: [...newEntry.tags, tag] })
                            }
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEntry}>Save Entry</Button>
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
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedMood} onValueChange={setSelectedMood}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All moods">All moods</SelectItem>
                {moods.map((mood) => (
                  <SelectItem key={mood} value={mood}>
                    {mood}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Journal Entries */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <PenTool className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No entries found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedMood !== "All moods"
                  ? "Try adjusting your filters"
                  : "Start writing your first journal entry"}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>Create Your First Entry</Button>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(entry.createdAt).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      {entry.mood && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
                          {entry.mood}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                </div>
                {entry.tags.length > 0 && (
                  <div className="flex items-center gap-2 mt-4">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Journal Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Journal Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{entries.length}</p>
              <p className="text-sm text-gray-600">Total Entries</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {entries.filter((e) => e.mood === "Happy" || e.mood === "Excited").length}
              </p>
              <p className="text-sm text-gray-600">Positive Days</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(entries.reduce((acc, entry) => acc + entry.content.length, 0) / entries.length) || 0}
              </p>
              <p className="text-sm text-gray-600">Avg. Words</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {entries.length > 0
                  ? Math.ceil(
                      (Date.now() - new Date(entries[entries.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24),
                    )
                  : 0}
              </p>
              <p className="text-sm text-gray-600">Days Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
