import React from 'react'
import { Clock, ThumbsUp, ThumbsDown, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getTimeRemaining } from '../utils/time'

export default function MarkerDetail() {
  // 👇 obtené todo de una sola vez del contexto
  const { selectedMarker, setSelectedMarker, voteMarker, currentUser } = useApp()

  // si no hay selección, no renderiza el modal
  if (!selectedMarker) return null

  const isCreator = selectedMarker.createdBy === currentUser

  const onVote = (confirm) => {
    try {
      voteMarker(selectedMarker.id, confirm)
      setSelectedMarker(null)
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[6000] pointer-events-auto">
      <div className="bg-white rounded-xl p-6 w-96 max-w-90vw shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{selectedMarker.streetName}</h3>
            <p className="text-sm text-gray-500">Reportado por: {selectedMarker.createdBy}</p>
          </div>
          <button onClick={() => setSelectedMarker(null)} className="text-gray-500 hover:text-gray-700 p-1">
            <X size={24} />
          </button>
        </div>

        {selectedMarker.photo && (
          <img
            src={selectedMarker.photo}
            alt="Marcador"
            className="w-full h-48 object-cover rounded-lg mb-4 shadow"
          />
        )}

        <p className="text-gray-700 mb-4 p-3 bg-gray-50 rounded-lg">{selectedMarker.description}</p>

        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex space-x-4 text-sm">
            <span className="text-green-600 font-medium">👍 {selectedMarker.votes.confirmations.length}</span>
            <span className="text-red-600 font-medium">👎 {selectedMarker.votes.denials.length}</span>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500 flex items-center">
              <Clock size={14} className="mr-1" />
              {getTimeRemaining(selectedMarker.expiresAt)}
            </span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => onVote(true)}
            disabled={isCreator}
            className={
              "flex-1 py-3 px-4 rounded-lg transition-colors flex items-center justify-center font-medium " +
              (isCreator
                ? "bg-green-300 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700")
            }
            title={isCreator ? "No puedes confirmar tu propia publicación" : "Confirmar"}
          >
            <ThumbsUp size={18} className="mr-2" /> Confirmar
          </button>

          <button
            onClick={() => onVote(false)}
            className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center font-medium"
          >
            <ThumbsDown size={18} className="mr-2" /> Negar
          </button>
        </div>
      </div>
    </div>
  )
}
