import React, { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Login from './components/Login'
import MapView from './components/MapView'
import MarkerList from './components/MarkerList'
import AddMarkerModal from './components/AddMarkerModal'
import MarkerDetail from './components/MarkerDetail'
import HelpPanel from './components/HelpPanel'
import './components/help.css' // <-- importa la animación del "?"
import ContactPanel from './components/ContactPanel'
import { MapPin, Plus, User, X, HelpCircle, Mail } from 'lucide-react'


function Header() {
  const { markers, setShowPanel, showPanel, logout, currentUser } = useApp()
  return (
    <div className="fixed top-3 left-0 right-0 z-[5000] px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-xl shadow px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="text-white" size={16} />
            </div>
            <span className="font-medium text-gray-800">Bienvenido, {currentUser}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">Activos: {markers.length}</span>
            <button onClick={() => setShowPanel(!showPanel)} className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition">
              <MapPin size={16} />
            </button>
            <button onClick={logout} className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition">
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddFab() {
  const { setPlacingMode } = useApp()
  return (
    <button
      onClick={() => setPlacingMode(true)}
      className="fixed bottom-20 right-6 bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center hover:bg-blue-700 transition z-[5000]"
      title="Agregar marcador: activá modo ubicación y hacé clic en el mapa"
    >
      <Plus />
    </button>
  )
}


/* NUEVO: Botón flotante “?” arriba a la izquierda */
function HelpFab({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-24 left-4 z-[5500] bg-white/90 backdrop-blur border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-white transition"
      title="Ayuda / Reglas"
    >
      <HelpCircle className="q-anim" />
    </button>
  )
}
function ContactFab({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[5500] bg-white/90 backdrop-blur border border-gray-200 rounded-full shadow px-4 h-10 flex items-center justify-center gap-2 hover:bg-white transition"
      title="Contacto"
    >
      <Mail size={16} />
      <span className="text-sm">Contacto</span>
    </button>
  )
}
function Shell() {
  const { currentUser, showAddForm, showPanel } = useApp()
  const [showContact, setShowContact] = React.useState(false)
  const [showHelp, setShowHelp] = React.useState(false)

  if (!currentUser) return <Login />

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <MapView />
      </div>

      <Header />

      {/* ACTIVAR HELP */}
      <HelpFab onClick={() => setShowHelp(true)} />
      {showHelp && <HelpPanel onClose={() => setShowHelp(false)} />}

      <AddFab />
      <ContactFab onClick={() => setShowContact(true)} />
      {showContact && <ContactPanel onClose={() => setShowContact(false)} />}

      {showPanel && (
        <div className="fixed top-24 right-4 w-96 max-h-[70vh] overflow-y-auto z-[5000]">
          <MarkerList />
        </div>
      )}

      {showAddForm && <AddMarkerModal />}
      <MarkerDetail />
    </div>
  )
}


export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
