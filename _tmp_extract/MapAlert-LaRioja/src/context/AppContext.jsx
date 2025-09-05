import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import StorageService from '../services/StorageService'
import MarkerStore from '../services/MarkerStore'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(StorageService.getCurrentUser())
  const [markers, setMarkers] = useState(MarkerStore.seedIfEmpty())
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const [placingMode, setPlacingMode] = useState(false) // modo para seleccionar ubicación
  const [newMarkerData, setNewMarkerData] = useState({ lat: null, lng: null, streetName: '', photo: null, description: '' })

  // Persist user
  useEffect(() => { StorageService.setCurrentUser(currentUser) }, [currentUser])

  // Limpieza de expirados cada segundo
  useEffect(() => {
    const t = setInterval(() => setMarkers(MarkerStore.cleanupExpired()), 1000)
    return () => clearInterval(t)
  }, [])

  // API
  const login = (username) => {
    if (!username || !username.trim()) return
    setCurrentUser(username.trim())
  }
  const logout = () => {
    setCurrentUser(null)
    setSelectedMarker(null)
    setShowAddForm(false)
    setShowPanel(false)
    setPlacingMode(false)
  }

  const addMarker = (data) => {
    const m = MarkerStore.addMarker(currentUser, data)
    setMarkers(MarkerStore.load())
    setShowAddForm(false)
    setPlacingMode(false)
    return m
  }

  const voteMarker = (markerId, isConfirm) => {
    setMarkers(MarkerStore.vote(currentUser, markerId, isConfirm))
  }

  const deleteMarker = (markerId) => {
    setMarkers(MarkerStore.delete(currentUser, markerId))
    setSelectedMarker(null)
  }

  const extendMarkerTime = (markerId) => {
    setMarkers(MarkerStore.extend(currentUser, markerId))
  }

  const value = useMemo(() => ({
    currentUser, markers, selectedMarker, showAddForm, showPanel, placingMode, newMarkerData,
    setSelectedMarker, setShowAddForm, setShowPanel, setPlacingMode, setNewMarkerData,
    login, logout, addMarker, voteMarker, deleteMarker, extendMarkerTime,
  }), [currentUser, markers, selectedMarker, showAddForm, showPanel, placingMode, newMarkerData])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider')
  return ctx
}
