import { Injectable, OnDestroy, OnInit } from '@angular/core';
import {Socket, io} from 'socket.io-client';
import { BehaviorSubject, Observable, filter, take } from 'rxjs';

export type ServerConnectionState = 'inital-connection' | 'connected' | 'disconnected';
export type ConnectionState = 'connected' | 'disconnected';
export type Message = {
  from: 'string';
  message: 'string'
}


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly socket: Socket
  readonly connectionState = new BehaviorSubject<ServerConnectionState>('disconnected');
  readonly messages = new BehaviorSubject<Message[]>([]);

  constructor() { 
    this.socket = io("ws://localhost:8080/", { autoConnect: false, });
    this.socket.on('connect', () => {
      console.log('initial connection')
      this.connectionState.next('inital-connection');
    });
    this.socket.on('disconnect', () => {
      console.log('disconnected')
      this.socket.disconnect()
      this.resetState()
    });
    this.socket.on('joined', () => {
      console.log('joined')
      this.connectionState.next('connected');
    })
    this.socket.on('old-messages', (messages: string[]) => {
      console.log(messages)
    })
    this.socket.on('message', (message: Message) => {
      console.log('new message', message)
      this.messages.next([...this.messages.value, message])
    })
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
      this.connectionState
        .pipe(
          filter(state => state !== 'inital-connection'),
          take(1)
        ).subscribe(() => {
          console.log('joining')
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
