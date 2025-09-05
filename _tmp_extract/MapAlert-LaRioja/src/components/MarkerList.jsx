import React, { useMemo } from 'react'
import { Clock, MapPin, Plus, Trash2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getTimeRemaining } from '../utils/time'

export default function MarkerList() {
  const {
    markers,
    currentUser,
    setShowPanel,
    deleteMarker,
    extendMarkerTime,
    setSelectedMarker,
  } = useApp()

  // 1) Tus marcadores primero; 2) dentro de cada grupo, los que vencen antes arriba
  const sortedMarkers = useMemo(() => {
    const mine = markers.filter(m => m.createdBy === currentUser)
    const others = markers.filter(m => m.createdBy !== currentUser)
    const sortByRemaining = arr =>
      arr.slice().sort((a, b) => (a.expiresAt - Date.now()) - (b.expiresAt - Date.now()))
    return [...sortByRemaining(mine), ...sortByRemaining(others)]
  }, [markers, currentUser])

  return (
    <div className="bg-white/95 backdrop-blur rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Panel de Control</h2>
        <button onClick={() => setShowPanel(false)} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {sortedMarkers.map(marker => {
          const isMine = marker.createdBy === currentUser
          return (
            <div
              key={marker.id}
              className={
                "bg-gray-50 rounded-lg p-3 border cursor-pointer transition " +
                (isMine ? "ring-1 ring-blue-200 border-blue-200" : "")
              }
              onClick={() => setSelectedMarker(marker)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm text-gray-800">{marker.streetName}</h3>
                  {isMine && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-blue-100 text-blue-700">
                      Tuyo
                    </span>
                  )}
                  <p className="text-xs text-gray-500">• Por: {marker.createdBy}</p>
                </div>
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock size={12} className="mr-1" />
                  {getTimeRemaining(marker.expiresAt)}
                </span>
              </div>

              <p className="text-xs text-gray-600 mb-2">{marker.description}</p>

              <div className="flex justify-between items-center text-xs">
                <div className="flex space-x-2">
                  <span className="text-green-600">👍 {marker.votes.confirmations.length}</span>
                  <span className="text-red-600">👎 {marker.votes.denials.length}</span>
                </div>

                <div className="flex space-x-1">
                  {isMine && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          try { extendMarkerTime(marker.id) } catch (err) { alert(err.message) }
                        }}
                        className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                        title="Extender 15 min"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          try { deleteMarker(marker.id) } catch (err) { alert(err.message) }
                        }}
                        className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        title="Eliminar"
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {sortedMarkers.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <MapPin size={48} className="mx-auto mb-4 opacity-30" />
            <p>No hay marcadores activos</p>
            <p className="text-xs mt-2">Haz click en el mapa para agregar uno</p>
          </div>
        )}
      </div>
    </div>
  )
}
