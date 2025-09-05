import StorageService from './StorageService'
import { todayKey } from '../utils/time'

export default class MarkerStore {
  static MAX_DURATION_MS = 60 * 60 * 1000; // 1h
  static INITIAL_DURATION_MS = 15 * 60 * 1000; // 15m
  static EXTENSION_MS = 15 * 60 * 1000; // 15m

  static seedIfEmpty() {
    const markers = StorageService.getMarkers();
    if (markers.length) return markers;
    const now = Date.now();
    const seeded = [
      {
        id: 1,
        lat: -29.4135,
        lng: -66.8570,
        streetName: "Av. San Martín 123",
        description: "Accidente de tránsito",
        photo: null,
        createdAt: now,
        expiresAt: now + this.INITIAL_DURATION_MS,
        createdBy: "usuario1",
        votes: { confirmations: ["usuario2", "usuario3"], denials: [] }
      },
      {
        id: 2,
        lat: -29.4145,
        lng: -66.8580,
        streetName: "Calle Rivadavia 456",
        description: "Manifestación pacífica",
        photo: null,
        createdAt: now - 5 * 60 * 1000,
        expiresAt: now + 10 * 60 * 1000,
        createdBy: "usuario4",
        votes: { confirmations: ["usuario1"], denials: ["usuario5"] }
      }
    ];
    StorageService.setMarkers(seeded);
    return seeded;
  }

  static load() {
    // Limpia expirados al cargar
    const markers = StorageService.getMarkers().filter(m => m.expiresAt > Date.now());
    StorageService.setMarkers(markers);
    return markers;
  }

  static save(markers) { StorageService.setMarkers(markers); }

  static canCreate(username) {
    const count = StorageService.getUserCreationsToday(username, todayKey());
    return count < 2;
  }

  static addMarker(username, data) {
    if (!this.canCreate(username)) {
      throw new Error('Límite diario alcanzado: puedes crear hasta 2 marcadores por día.');
    }
    const now = Date.now();
    const marker = {
      id: now,
      lat: data.lat, lng: data.lng,
      streetName: data.streetName,
      description: data.description || '',
      photo: data.photo || null,
      createdAt: now,
      expiresAt: now + this.INITIAL_DURATION_MS,
      createdBy: username,
      votes: { confirmations: [username], denials: [] }, // el creador confirma
    };
    const markers = this.load();
    markers.push(marker);
    this.save(markers);
    StorageService.incUserCreations(username, todayKey());
    return marker;
  }

  static vote(username, markerId, isConfirm) {
  const markers = this.load();
  const idx = markers.findIndex(m => m.id === markerId);
  if (idx === -1) return markers;

  const m = { ...markers[idx] };

  // 1 sola vez por publicación
  const userVotes = StorageService.getUserVotes(username);
  if (userVotes.has(markerId)) {
    throw new Error('Ya has votado en esta publicación.');
  }

  // ❗El creador no puede confirmarse a sí mismo
  if (isConfirm && m.createdBy === username) {
    throw new Error('No puedes confirmar tu propia publicación.');
  }

  if (isConfirm) {
    m.votes = { ...m.votes, confirmations: [...m.votes.confirmations, username] };
    const currentDuration = m.expiresAt - m.createdAt;
    if (currentDuration < this.MAX_DURATION_MS) {
      m.expiresAt = Math.min(m.expiresAt + this.EXTENSION_MS, m.createdAt + this.MAX_DURATION_MS);
    }
  } else {
    m.votes = { ...m.votes, denials: [...m.votes.denials, username] };
  }

  markers[idx] = m;
  this.save(markers);
  StorageService.addUserVote(username, markerId);
  return markers;
}
  static delete(username, markerId) {
    const markers = this.load();
    const marker = markers.find(m => m.id === markerId);
    if (!marker) return markers;
    if (marker.createdBy !== username) {
      throw new Error('Solo puedes eliminar tus propias publicaciones.');
    }
    const updated = markers.filter(m => m.id !== markerId);
    this.save(updated);
    return updated;
  }

  static extend(username, markerId) {
    const markers = this.load();
    const idx = markers.findIndex(m => m.id === markerId);
    if (idx === -1) return markers;
    const m = markers[idx];
    if (m.createdBy !== username) {
      throw new Error('Solo puedes extender el tiempo de tus propias publicaciones.');
    }
    const currentDuration = m.expiresAt - m.createdAt;
    if (currentDuration >= this.MAX_DURATION_MS) {
      throw new Error('Este marcador ya alcanzó el tiempo máximo de 1 hora.');
    }
    const updated = { ...m, expiresAt: Math.min(m.expiresAt + this.EXTENSION_MS, m.createdAt + this.MAX_DURATION_MS) };
    markers[idx] = updated;
    this.save(markers);
    return markers;
  }

  static cleanupExpired() {
    const cleaned = this.load();
    this.save(cleaned);
    return cleaned;
  }
}
