import { Injectable, OnDestroy, OnInit } from '@angular/core';
import {Socket, io} from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

export type ServerConnectionState = 'inital-connection' | 'connected' | 'disconnected';
export type ConnectionState = 'connected' | 'disconnected';
export type Message = {
  from: string
  text: string
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly socket: Socket
  readonly connectionState = new BehaviorSubject<ServerConnectionState>('disconnected');
  readonly messages = new BehaviorSubject<Message[]>([]);

  constructor(
    private readonly localStorageService: LocalStorageService
  ) { 
    this.socket = io("ws://localhost:8080/", { autoConnect: false, });
    this.listenEvents()
    this.init()
  }

  private listenEvents() {
    this.socket.on('connect', () => {
      this.connectionState.next('connected');
      const auth = this.socket.auth as { username: string }
      this.localStorageService.setConnection({ username: auth.username })
    });
    this.socket.on('disconnect', () => {
      this.socket.disconnect()
      this.resetState()
      this.socket.auth = {}
    });
    this.socket.on('old-messages', (messages: Message[]) => {
      this.messages.next(messages)
    })
    this.socket.on('message', (message: Message) => {
      this.messages.next([...this.messages.value, message])
    })
  }

  private init () {
    const connection = this.localStorageService.getConnection();
    if (connection != null) {
      this.connect(connection)
    }
  }

  private resetState() {
    this.connectionState.next('disconnected');
    this.messages.next([]);
  }

  connect({
    username
  }: {
    username: string;
  }) {
    if (!this.socket.connected) {
      this.socket.auth = { username };
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket.connected) {
      this.localStorageService.setConnection(null)
      this.socket.disconnect();
    }
  }

  sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  getAuthUsername(): string {
    const {username} = this.socket.auth as { username: string }
    return username
  }
}
