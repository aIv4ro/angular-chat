import { Injectable } from '@angular/core';

interface Connection {
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly storage = window.localStorage;

  constructor() { }

  getConnection () {
    const connection = this.storage.getItem('connection');
    if (connection == null) return null;
    return JSON.parse(connection) as Connection;
  }

  setConnection(connection: Connection | null) {
    if (connection == null) {
      this.storage.removeItem('connection');
      return;
    }
    this.storage.setItem('connection', JSON.stringify(connection));
  }
}
