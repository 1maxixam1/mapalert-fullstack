import React from 'react'
import { X, Info } from 'lucide-react'

export default function HelpPanel({ onClose }) {
  return (
    <div className="fixed top-24 left-4 z-[5500] w-[360px] max-w-[92vw] pointer-events-auto">
      <div className="bg-white/95 backdrop-blur rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Info className="text-blue-600" size={18} />
            <h3 className="font-semibold text-gray-800">Reglas y funcionamiento</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="px-4 py-3 text-sm text-gray-700 space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Publicaciones por día:</strong> cada usuario puede crear <strong>hasta 2 marcadores por día</strong>.</li>
            <li><strong>Votos:</strong> cada usuario puede votar <strong>una sola vez por publicación</strong> (Confirmar o Negar).</li>
            <li>
              <strong>Tiempo del marcador:</strong> inicia con <strong>15 minutos</strong>.
              Cada <strong>confirmación</strong> suma <strong>+15 min</strong> (y el creador también puede extender), 
              hasta un máximo de <strong>1 hora</strong>.
            </li>
            <li>Para <strong>agregar</strong> un marcador: presioná “+”, luego <strong>hacé clic en el mapa</strong> donde está el control y completá el formulario.</li>
            <li>Podés <strong>ver</strong> y gestionar tus marcadores desde el <strong>panel</strong>.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
