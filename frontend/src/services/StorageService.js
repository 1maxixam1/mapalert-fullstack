// Simple wrapper sobre localStorage con namespacing
export default class StorageService {
  static NS = 'mapalert';

  static _key(key) { return `${this.NS}:${key}`; }

  static get(key, fallback=null) {
    try {
      const raw = localStorage.getItem(this._key(key));
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  static set(key, value) {
    localStorage.setItem(this._key(key), JSON.stringify(value));
  }

  // Marcadores globales
  static getMarkers() {
    return this.get('markers', []);
  }
  static setMarkers(markers) {
    this.set('markers', markers);
  }

  // Usuario actual (persistencia opcional)
  static getCurrentUser() {
    return this.get('currentUser', null);
  }
  static setCurrentUser(username) {
    this.set('currentUser', username);
  }

  // Votos por usuario: set de IDs
  static getUserVotes(username) {
    return new Set(this.get(`votes:${username}`, []));
  }
  static addUserVote(username, markerId) {
    const votes = this.getUserVotes(username);
    votes.add(markerId);
    this.set(`votes:${username}`, Array.from(votes));
  }

  // Creaciones por usuario y día (máx 2)
  static getUserCreationsToday(username, dayKey) {
    return this.get(`creations:${username}:${dayKey}`, 0);
  }
  static incUserCreations(username, dayKey) {
    const curr = this.getUserCreationsToday(username, dayKey);
    this.set(`creations:${username}:${dayKey}`, curr + 1);
  }
}
