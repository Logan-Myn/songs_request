'use client'

import { useState, useEffect } from 'react'
import { initializeApp } from "firebase/app"
import { getFirestore, collection, query, orderBy, onSnapshot, Timestamp, doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore"

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
  timestamp: Timestamp;
  played: boolean;
  playedTimestamp?: Timestamp;
}

export default function Admin() {
  const [requests, setRequests] = useState<SongRequest[]>([])

  useEffect(() => {
    const q = query(collection(db, "songRequests"), orderBy("timestamp", "desc"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const songRequests: SongRequest[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        songRequests.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp as Timestamp,
          played: data.played || false,
          playedTimestamp: data.playedTimestamp as Timestamp | undefined
        } as SongRequest)
      })
      setRequests(songRequests)
    })

    return () => unsubscribe()
  }, [])

  const togglePlayed = async (id: string, played: boolean) => {
    const docRef = doc(db, "songRequests", id);
    const newPlayedStatus = !played;
    const updateData: { played: boolean; playedTimestamp?: Timestamp | null } = {
      played: newPlayedStatus,
    };
    if (newPlayedStatus) {
      updateData.playedTimestamp = Timestamp.now();
    } else {
      updateData.playedTimestamp = null;
    }
    await updateDoc(docRef, updateData);
  }

  const deleteRequest = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      const docRef = doc(db, "songRequests", id);
      await deleteDoc(docRef);
    }
  }

  const deleteAllPlayed = async () => {
    if (window.confirm("Are you sure you want to delete all played songs?")) {
      const batch = writeBatch(db);
      requests.forEach((request) => {
        if (request.played) {
          const docRef = doc(db, "songRequests", request.id);
          batch.delete(docRef);
        }
      });
      await batch.commit();
    }
  }

  const sortedRequests = [...requests].sort((a, b) => {
    if (a.played === b.played) {
      if (a.played) {
        // If both are played, sort by playedTimestamp (most recent first)
        return (b.playedTimestamp?.toMillis() || 0) - (a.playedTimestamp?.toMillis() || 0);
      } else {
        // If both are not played, sort by original timestamp (most recent first)
        return b.timestamp.toMillis() - a.timestamp.toMillis();
      }
    }
    // Not played requests come before played requests
    return a.played ? 1 : -1;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Song Requests</h1>
          <button
            onClick={deleteAllPlayed}
            className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-300"
          >
            Delete All Played
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {sortedRequests.map((request) => (
              <li key={request.id} className={`px-6 py-4 hover:bg-gray-50 ${request.played ? 'bg-gray-100' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {request.songTitle}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {request.artist}
                    </p>
                    {request.message && (
                      <p className="mt-1 text-sm text-gray-600">
                        {request.message}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                    <p className="text-sm text-gray-500">
                      {request.timestamp.toDate().toLocaleString()}
                    </p>
                    <div className="mt-2 flex items-center">
                      <span className="mr-2 text-sm text-gray-500">Played?</span>
                      <input
                        type="checkbox"
                        checked={request.played}
                        onChange={() => togglePlayed(request.id, request.played)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                    {request.played && request.playedTimestamp && (
                      <p className="text-xs text-gray-400 mt-1">
                        Played: {request.playedTimestamp.toDate().toLocaleString()}
                      </p>
                    )}
                    <button
                      onClick={() => deleteRequest(request.id)}
                      className="mt-2 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
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