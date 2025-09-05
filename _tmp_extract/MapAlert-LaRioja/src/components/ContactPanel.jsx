import React, { useState } from 'react'
import { Mail, X } from 'lucide-react'

export default function ContactPanel({ onClose }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const email = 'maxmaxterck@gmail.com'

  const sendEmail = () => {
    const subject = encodeURIComponent('Contacto MapAlert')
    const body = encodeURIComponent(`Nombre: ${name}\n\n${message}`)
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  return (
    <div className="fixed bottom-24 right-4 z-[5500] w-[360px] max-w-[92vw] pointer-events-auto">
      <div className="bg-white/95 backdrop-blur rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Mail className="text-blue-600" size={18} />
            <h3 className="font-semibold text-gray-800">Contacto</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="px-4 py-3 text-sm text-gray-700 space-y-3">
          <p>
            Envíanos un email a{' '}
            <a className="text-blue-600 underline" href="mailto:maxmaxterck@gmail.com">
              maxmaxterck@gmail.com
            </a>{' '}
            o completa y presiona “Enviar”.
          </p>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tu mensaje"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <div className="flex justify-end gap-2">
            <a
              href="mailto:maxmaxterck@gmail.com"
              className="px-3 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
            >
              Abrir correo
            </a>
            <button
              onClick={sendEmail}
              className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
