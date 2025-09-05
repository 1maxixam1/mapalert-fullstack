import React from 'react'
import { MapPin, LogIn } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Login() {
  const { login } = useApp()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">MapAlert</h1>
          <p className="text-gray-600">Reporta y confirma eventos en tiempo real</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault()
          const username = e.currentTarget.username.value
          login(username)
        }}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de usuario</label>
            <input
              type="text"
              name="username"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa tu nombre de usuario"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center"
          >
            <LogIn className="mr-2" size={20} />
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Usuarios de ejemplo: usuario1, usuario2, usuario3, etc.</p>
        </div>
      </div>
    </div>
  )
}
