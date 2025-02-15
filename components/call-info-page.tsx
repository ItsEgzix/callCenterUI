"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone, MessageSquare, Mail, Clock, Edit, Check, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import KeypadPage from "./keypad-page"

const mockData = [
  {
    id: 1,
    name: "Alice Johnson",
    phone: "+1 (555) 123-4567",
    email: "alice@example.com",
    avatar: "/placeholder.svg?height=96&width=96",
    calls: [
      {
        time: "Today at 10:30 AM",
        duration: "15 min",
        summary: "Scheduled a meeting for next week on Tuesday at 2 PM.",
        transcription: [
          { speaker: "AI", text: "Hello Alice, how can I assist you today?" },
          { speaker: "Alice", text: "I need to schedule a meeting for next week." },
          { speaker: "AI", text: "Certainly, I can help you with that. What day and time works best for you?" },
          { speaker: "Alice", text: "How about Tuesday at 2 PM?" },
          {
            speaker: "AI",
            text: "Tuesday at 2 PM works great. I've scheduled the meeting for you. Is there anything else you need?",
          },
          { speaker: "Alice", text: "No, that's all. Thank you!" },
          { speaker: "AI", text: "You're welcome, Alice. Have a great day!" },
        ],
      },
      {
        time: "Yesterday",
        duration: "5 min",
        summary: "Confirmed appointment for tomorrow at 3 PM.",
        transcription: [
          { speaker: "AI", text: "Good morning, Alice. How may I help you?" },
          { speaker: "Alice", text: "I just wanted to confirm my appointment for tomorrow." },
          {
            speaker: "AI",
            text: "Of course, let me check that for you. Yes, your appointment is confirmed for tomorrow at 3 PM.",
          },
          { speaker: "Alice", text: "Perfect, thank you!" },
          { speaker: "AI", text: "You're welcome. Is there anything else you need assistance with?" },
          { speaker: "Alice", text: "No, that's all. Thanks again!" },
          { speaker: "AI", text: "My pleasure, Alice. Have a great day ahead!" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Bob Smith",
    phone: "+1 (555) 987-6543",
    email: "bob@example.com",
    avatar: "/placeholder.svg?height=96&width=96",
    calls: [
      {
        time: "Yesterday",
        duration: "10 min",
        summary: "Updated account information with new address: 123 New Street, Anytown, USA 12345",
        transcription: [
          { speaker: "AI", text: "Hello Bob, how can I assist you today?" },
          { speaker: "Bob", text: "I need to update my account information." },
          { speaker: "AI", text: "Certainly, I can help you with that. What information would you like to update?" },
          { speaker: "Bob", text: "I've moved to a new address." },
          { speaker: "AI", text: "I see. Can you please provide me with your new address?" },
          { speaker: "Bob", text: "123 New Street, Anytown, USA 12345" },
          {
            speaker: "AI",
            text: "Thank you, Bob. I've updated your address in our system. Is there anything else you need help with?",
          },
          { speaker: "Bob", text: "No, that's all for now. Thanks!" },
          { speaker: "AI", text: "You're welcome, Bob. Have a great day!" },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Charlie Brown",
    phone: "+1 (555) 246-8135",
    email: "charlie@example.com",
    avatar: "/placeholder.svg?height=96&width=96",
    calls: [
      {
        time: "2 days ago",
        duration: "30 min",
        summary: "Troubleshooted internet connection issue.",
        transcription: [
          { speaker: "AI", text: "Hello Charlie, how may I assist you today?" },
          { speaker: "Charlie", text: "I'm having trouble with my internet connection." },
          {
            speaker: "AI",
            text: "I'm sorry to hear that. Let's troubleshoot the issue. Have you tried restarting your router?",
          },
          { speaker: "Charlie", text: "Yes, I've already done that." },
          {
            speaker: "AI",
            text: "Okay, let's try a few more steps. Can you please check if all the cables are properly connected?",
          },
          { speaker: "Charlie", text: "Yes, they all seem to be connected correctly." },
          {
            speaker: "AI",
            text: "I see. Let's try resetting your network settings. I'll guide you through the process...",
          },
          // ... more troubleshooting steps ...
          { speaker: "Charlie", text: "Great, it's working now! Thank you so much for your help." },
          {
            speaker: "AI",
            text: "You're welcome, Charlie. I'm glad we could resolve the issue. Is there anything else you need assistance with?",
          },
          { speaker: "Charlie", text: "No, that's all. Thanks again!" },
          {
            speaker: "AI",
            text: "It's my pleasure, Charlie. Have a great day, and don't hesitate to call if you need any further assistance.",
          },
        ],
      },
    ],
  },
]

export default function CallInfoPage() {
  const [selectedPerson, setSelectedPerson] = React.useState(mockData[0])
  const [editMode, setEditMode] = React.useState(false)
  const [editedPerson, setEditedPerson] = React.useState(selectedPerson)
  const [expandedCall, setExpandedCall] = React.useState<number | null>(null)
  const [currentPage, setCurrentPage] = React.useState<"recents" | "keypad">("keypad")

  const handleEdit = () => {
    setEditMode(true)
    setEditedPerson(selectedPerson)
  }

  const handleSave = () => {
    setSelectedPerson(editedPerson)
    setEditMode(false)
    // In a real application, you would save the changes to your backend here
  }

  const handleCancel = () => {
    setEditMode(false)
    setEditedPerson(selectedPerson)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPerson({ ...editedPerson, [e.target.name]: e.target.value })
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <aside className="w-64 bg-card text-card-foreground p-4 hidden md:block">
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" onClick={() => setCurrentPage("keypad")}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Keypad
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => setCurrentPage("recents")}>
            <Phone className="mr-2 h-4 w-4" />
            Recents
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">
        {currentPage === "keypad" ? (
          <KeypadPage />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent Calls */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Calls</CardTitle>
                <CardDescription>Your latest call activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {mockData.map((person) => (
                    <li
                      key={person.id}
                      className="flex items-center space-x-4 cursor-pointer hover:bg-accent rounded-md p-2"
                      onClick={() => setSelectedPerson(person)}
                    >
                      <Avatar>
                        <AvatarImage src={person.avatar} alt={person.name} />
                        <AvatarFallback>
                          {person.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{person.name}</p>
                        <p className="text-sm text-muted-foreground">{person.calls[0].time}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">{person.calls[0].duration}</div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Person Details */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Contact Details</CardTitle>
                  {!editMode && (
                    <Button variant="ghost" size="sm" onClick={handleEdit}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={selectedPerson.avatar} alt={selectedPerson.name} />
                      <AvatarFallback>
                        {selectedPerson.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {editMode ? (
                      <div className="space-y-2 w-full">
                        <Input name="name" value={editedPerson.name} onChange={handleInputChange} placeholder="Name" />
                        <Input
                          name="phone"
                          value={editedPerson.phone}
                          onChange={handleInputChange}
                          placeholder="Phone"
                        />
                        <Input
                          name="email"
                          value={editedPerson.email}
                          onChange={handleInputChange}
                          placeholder="Email"
                        />
                        <div className="flex justify-end space-x-2">
                          <Button onClick={handleSave} size="sm">
                            <Check className="mr-2 h-4 w-4" />
                            Save
                          </Button>
                          <Button onClick={handleCancel} variant="outline" size="sm">
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 w-full">
                        <h3 className="text-xl font-semibold">{selectedPerson.name}</h3>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4" />
                          <span>{selectedPerson.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4" />
                          <span>{selectedPerson.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>Last call: {selectedPerson.calls[0].time}</span>
                        </div>
                      </div>
                    )}
                    {!editMode && (
                      <div className="flex space-x-2 w-full">
                        <Button className="flex-1">
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Call History</CardTitle>
                  <CardDescription>Recent calls and transcriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    {selectedPerson.calls.map((call, index) => (
                      <Card key={index} className="mb-4 p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-primary">{call.time}</h4>
                          <span className="text-sm font-medium text-muted-foreground">{call.duration}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{call.summary}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedCall(expandedCall === index ? null : index)}
                          className="w-full justify-center"
                        >
                          {expandedCall === index ? "Hide" : "Show"} Transcription
                        </Button>
                        {expandedCall === index && (
                          <div className="mt-2 space-y-2">
                            {call.transcription.map((entry, i) => (
                              <div
                                key={i}
                                className={`flex ${entry.speaker === "AI" ? "justify-start" : "justify-end"}`}
                              >
                                <div
                                  className={`max-w-[80%] rounded-lg p-2 ${
                                    entry.speaker === "AI"
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-secondary text-secondary-foreground"
                                  }`}
                                >
                                  <p className="text-sm font-semibold">{entry.speaker}</p>
                                  <p className="text-sm">{entry.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

