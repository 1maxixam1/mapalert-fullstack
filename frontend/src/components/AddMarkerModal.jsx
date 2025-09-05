import React from 'react'
import { Upload } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function AddMarkerModal() {
  const { newMarkerData, setNewMarkerData, setShowAddForm, addMarker, setPlacingMode } = useApp()

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setNewMarkerData(prev => ({ ...prev, photo: e.target.result }))
      reader.readAsDataURL(file)
    }
  }

  const onConfirm = () => {
    if (!newMarkerData.streetName.trim() || !newMarkerData.lat || !newMarkerData.lng) {
      alert('Por favor completa todos los campos requeridos')
      return
    }
    try {
      addMarker(newMarkerData)
      setNewMarkerData({ lat: null, lng: null, streetName: '', photo: null, description: '' })
    } catch (e) {
      alert(e.message)
    }
  }

  const onCancel = () => {
    setShowAddForm(false)
    setPlacingMode(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[6000] pointer-events-auto">
      <div className="bg-white rounded-xl p-6 w-96 max-w-90vw shadow-2xl">
        <h3 className="text-xl font-bold mb-4 text-gray-800">🗺️ Nuevo Marcador</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la calle *</label>
            <input
              type="text"
              value={newMarkerData.streetName}
              onChange={(e) => setNewMarkerData(prev => ({ ...prev, streetName: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Av. San Martín 123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={newMarkerData.description}
              onChange={(e) => setNewMarkerData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Describe qué está ocurriendo..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto (opcional)</label>
            <div className="flex items-center space-x-2">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="photo-upload" />
              <label
                htmlFor="photo-upload"
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Upload size={16} className="mr-2" />
                Subir foto
              </label>
              {newMarkerData.photo && <span className="text-sm text-green-600 font-medium">✓ Foto cargada</span>}
            </div>
          </div>

          {newMarkerData.photo && (
            <div className="mt-2">
              <img src={newMarkerData.photo} alt="Preview" className="w-full h-32 object-cover rounded-lg shadow" />
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <button onClick={onConfirm} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium">📍 Confirmar</button>
          <button onClick={onCancel} className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors">Cancelar</button>
        </div>
      </div>
    </div>
  )
}
