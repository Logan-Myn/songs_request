'use client'

import { useState, useEffect } from 'react'
import { initializeApp } from "firebase/app"
import { getFirestore, collection, query, orderBy, onSnapshot } from "firebase/firestore"

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

interface SongRequest {
  id: string;
  songTitle: string;
  artist: string;
  message: string;
  timestamp: Date;
}

export default function Admin() {
  const [requests, setRequests] = useState<SongRequest[]>([])

  useEffect(() => {
    const q = query(collection(db, "songRequests"), orderBy("timestamp", "desc"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const songRequests: SongRequest[] = []
      querySnapshot.forEach((doc) => {
        songRequests.push({ id: doc.id, ...doc.data() } as SongRequest)
      })
      setRequests(songRequests)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Song Requests</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {requests.map((request) => (
              <li key={request.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {request.songTitle}
                    </p>
                    <p className="text-sm text-gray-500">
                      {request.artist}
                    </p>
                    {request.message && (
                      <p className="mt-1 text-sm text-gray-600">
                        {request.message}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <p className="text-sm text-gray-500">
                      {request.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}