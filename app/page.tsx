'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Instagram } from 'lucide-react'
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBB1tmUmev5DsNdDuV6ZmOH47i7ziFLoiI",
  authDomain: "song-request-48795.firebaseapp.com",
  projectId: "song-request-48795",
  storageBucket: "song-request-48795.appspot.com",
  messagingSenderId: "537084650592",
  appId: "1:537084650592:web:6f0d7401f95f6fa7178f05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default function Home() {
  const [songTitle, setSongTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [message, setMessage] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Add document to Firestore
      await addDoc(collection(db, "songRequests"), {
        songTitle,
        artist,
        message,
        timestamp: new Date()
      })
      // Reset form
      setSongTitle('')
      setArtist('')
      setMessage('')
      // Open the dialog
      setIsDialogOpen(true)
    } catch (error) {
      console.error("Error adding document: ", error)
      alert('Failed to submit song request. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Request a Song</h2>
          <p className="text-center text-sm text-gray-600 mb-8">If it fits the vibe, I will play it!</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="songTitle" className="text-sm font-medium text-gray-700">
                Song Title
              </Label>
              <Input
                id="songTitle"
                placeholder="Enter song title"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist" className="text-sm font-medium text-gray-700">
                Artist
              </Label>
              <Input
                id="artist"
                placeholder="Enter artist name"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                Message (Optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Any special message for the DJ?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md hover:from-purple-600 hover:to-blue-600 transition duration-300">
              Submit Request
            </Button>
          </form>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Thanks for Your Request!</DialogTitle>
            <DialogDescription className="text-center">
              Follow us on Instagram to stay updated on our upcoming parties!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <a
              href="https://www.instagram.com/pulsar.events_/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transition duration-300"
            >
              <Instagram className="w-5 h-5 mr-2" />
              Follow on Instagram
            </a>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}