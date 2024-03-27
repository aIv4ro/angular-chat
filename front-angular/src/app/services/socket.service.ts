import { Injectable, OnDestroy, OnInit } from '@angular/core';
import {Socket, io} from 'socket.io-client';
import { BehaviorSubject, Observable, filter, take } from 'rxjs';

export type ServerConnectionState = 'inital-connection' | 'connected' | 'disconnected';
export type ConnectionState = 'connected' | 'disconnected';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly socket: Socket
  readonly connectionState = new BehaviorSubject<ServerConnectionState>('disconnected');

  constructor() { 
    this.socket = io("ws://localhost:8080/", { autoConnect: false, });
    this.socket.on('connect', () => {
      this.connectionState.next('inital-connection');
    });
    this.socket.on('disconnect', () => {
      this.connectionState.next('disconnected');
    });
    this.socket.on('joined', () => {
      this.connectionState.next('connected');
    })
  }

  connect({
    username
  }: {
    username: string;
  }) {
    if (!this.socket.connected) {
      this.connectionState
        .pipe(
          filter(state => state !== 'inital-connection'),
          take(1)
        ).subscribe(() => {
          console.log('join to server')
          this.socket.emit('join', { username });
        })
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }
}
