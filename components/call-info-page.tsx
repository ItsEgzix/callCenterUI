"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Phone,
  MessageSquare,
  Mail,
  Clock,
  Edit,
  Check,
  X,
  Menu,
  Settings,
  ArrowDownLeft,
  ArrowUpRight,
  XCircle,
  CheckCircle,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import KeypadPage from "./keypad-page"
import { SettingsPanel } from "./setting-panel"

interface Transcription {
  role: string
  text: string
}

interface CallHistory {
  time: string
  duration: number | null
  transcriptions: Transcription[]
}

interface Person {
  id: string
  name: string
  phone: string
  email: string
  lastCall: string
  callHistory: CallHistory[]
}

interface Call {
  id: string
  customerId: number
  customerName: string
  time: string
  duration: number | null
  status?: string
  direction?: string
}

const getInitials = (name: string | null | undefined): string => {
  if (!name || typeof name !== "string") return "?"
  return (
    name
      .split(" ")
      .map((part) => part[0] || "")
      .join("")
      .toUpperCase() || "?"
  )
}

export default function CallInfoPage() {
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(null)
  const [editMode, setEditMode] = React.useState(false)
  const [editedPerson, setEditedPerson] = React.useState<Partial<Person>>({})
  const [expandedCall, setExpandedCall] = React.useState<number | null>(null)
  const [currentPage, setCurrentPage] = React.useState("recents")
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [recentCalls, setRecentCalls] = React.useState<Call[]>([])
  const [userDetails, setUserDetails] = React.useState<Person | null>(null)
  const [settings, setSettings] = React.useState({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetchRecentCalls()
  }, [])

  const fetchRecentCalls = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("https://ai-call-center-o77f.onrender.com/recentcallsRouter/history")
      if (!response.ok) {
        throw new Error(`HTTP error. Status: ${response.status}`)
      }
      const data = await response.json()
      setRecentCalls(data)
    } catch (error) {
      console.error("Failed to fetch recent calls:", error)
      setError("Failed to load recent calls. Please try again later.")
      setRecentCalls([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserDetails = async (customerId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://ai-call-center-o77f.onrender.com/userRouter/customer/details?id=${customerId}`)
      if (!response.ok) {
        throw new Error(`HTTP error. Status: ${response.status}`)
      }
      const data = await response.json()
      setUserDetails(data)
      setSelectedPerson(data)
    } catch (error) {
      console.error("Failed to fetch user details:", error)
      setError("Failed to load user details. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    if (selectedPerson) {
      setEditMode(true)
      setEditedPerson(selectedPerson)
    }
  }

  const handleSave = async () => {
    if (!selectedPerson) return

    try {
      const nameParts = (editedPerson.name || "").split(" ")
      const firstName = nameParts.shift() || ""
      const lastName = nameParts.join(" ")

      const response = await fetch("http://127.0.0.1:8000/userRouter/customer/details", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedPerson.id,
          firstName,
          lastName,
          phone: editedPerson.phone || "",
          email: editedPerson.email || "",
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error. Status: ${response.status}`)
      }

      // Update local state
      setSelectedPerson({ ...selectedPerson, ...editedPerson })
      setEditMode(false)
    } catch (err) {
      console.error("Failed to update user:", err)
      setError("Failed to update user. Please try again later.")
    }
  }

  const handleCancel = () => {
    setEditMode(false)
    if (selectedPerson) {
      setEditedPerson(selectedPerson)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPerson({ ...editedPerson, [e.target.name]: e.target.value })
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <aside
        className={`w-64 bg-card text-card-foreground p-4 fixed md:relative transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40 h-screen`}
      >
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" onClick={() => setCurrentPage("keypad")}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Keypad
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => setCurrentPage("recents")}>
            <Phone className="mr-2 h-4 w-4" />
            Recents
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => setCurrentPage("settings")}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </aside>
      <main className="flex-1 p-4 overflow-auto">
        {currentPage === "keypad" && <KeypadPage />}
        {currentPage === "settings" && (
          <SettingsPanel onSave={(newSettings) => setSettings(newSettings)} onClose={() => setCurrentPage("recents")} />
        )}
        {currentPage === "recents" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Calls</CardTitle>
                <CardDescription>Your latest call activities</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && <p className="text-center py-4">Loading recent calls...</p>}
                {error && <p className="text-center py-4 text-red-500">{error}</p>}
                {!isLoading && !error && recentCalls.length === 0 && (
                  <p className="text-center py-4">No recent calls found</p>
                )}
                {!isLoading && !error && recentCalls.length > 0 && (
                  <ScrollArea className="h-[790px] w-full rounded-md border p-2">
                    <ul className="space-y-4">
                      {recentCalls.map((call) => (
                        <li
                          key={call.id}
                          className="flex items-center space-x-4 cursor-pointer hover:bg-accent rounded-md p-2"
                          onClick={() => fetchUserDetails(call.customerId)}
                        >
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=96&width=96" alt={call.customerName} />
                            <AvatarFallback>{getInitials(call.customerName)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{call.customerName || "Unknown"}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(call.time).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {call.direction === "INBOUND" ? (
                              <ArrowDownLeft className="h-4 w-4 text-blue-600" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 text-purple-600" />
                            )}
                            {call.status === "ANSWERED" ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {call.duration ? `${call.duration} min` : "N/A"}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
            {selectedPerson && (
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
                    {isLoading ? (
                      <p className="text-center py-4">Loading contact details...</p>
                    ) : (
                      <div className="flex flex-col items-center space-y-4">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src="/placeholder.svg?height=96&width=96" alt={selectedPerson.name} />
                          <AvatarFallback>{getInitials(selectedPerson.name)}</AvatarFallback>
                        </Avatar>
                        {editMode ? (
                          <div className="space-y-2 w-full">
                            <Input
                              name="name"
                              value={editedPerson.name || ""}
                              onChange={handleInputChange}
                              placeholder="Name"
                            />
                            <Input
                              name="phone"
                              value={editedPerson.phone || ""}
                              onChange={handleInputChange}
                              placeholder="Phone"
                            />
                            <Input
                              name="email"
                              value={editedPerson.email || ""}
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
                            <h3 className="text-xl font-semibold">{selectedPerson.name || "Unknown"}</h3>
                            <div className="flex items-center">
                              <Phone className="mr-2 h-4 w-4" />
                              <span>{selectedPerson.phone || "No phone number"}</span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="mr-2 h-4 w-4" />
                              <span>{selectedPerson.email || "No email address"}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              <span>
                                Last call:{" "}
                                {selectedPerson.lastCall
                                  ? new Date(selectedPerson.lastCall).toLocaleString()
                                  : "Never"}
                              </span>
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
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Call History</CardTitle>
                    <CardDescription>Recent calls and transcriptions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <p className="text-center py-4">Loading call history...</p>
                    ) : (
                      <ScrollArea className="h-[390px] w-full rounded-md border p-4">
                        {selectedPerson.callHistory && selectedPerson.callHistory.length > 0 ? (
                          selectedPerson.callHistory.map((call, index) => (
                            <Card key={index} className="mb-4 p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-primary">
                                  {new Date(call.time).toLocaleString()}
                                </h4>
                                <span className="text-sm font-medium text-muted-foreground">
                                  {call.duration ? `${call.duration} min` : "N/A"}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedCall(expandedCall === index ? null : index)}
                                className="w-full justify-center"
                              >
                                {expandedCall === index ? "Hide" : "Show"} Transcription
                              </Button>
                              {expandedCall === index && call.transcriptions && (
                                <div className="mt-2 space-y-2">
                                  {call.transcriptions.map((entry, i) => (
                                    <div
                                      key={i}
                                      className={`flex ${
                                        entry.role === "ai" ? "justify-start" : "justify-end"
                                      }`}
                                    >
                                      <div
                                        className={`max-w-[80%] rounded-lg p-2 ${
                                          entry.role === "ai"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-secondary-foreground"
                                        }`}
                                      >
                                        <p className="text-sm font-semibold">{entry.role}</p>
                                        <p className="text-sm">{entry.text}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </Card>
                          ))
                        ) : (
                          <p className="text-center py-4">No call history available</p>
                        )}
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
