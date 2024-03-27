import { Injectable, OnDestroy, OnInit } from '@angular/core';
import {Socket, io} from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

type ConnectionState = 'connected' | 'disconnected';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit, OnDestroy {
  private readonly socket: Socket
  connectionState = new BehaviorSubject<ConnectionState>('disconnected');

  constructor() { 
    this.socket = io("ws://localhost:8080/", {
      autoConnect: false,
    });
  }

  ngOnInit() {
    this.socket.on('connect', () => { 
      console.log('connected')
      this.connectionState.next('connected'); 
    });
    this.socket.on('disconnect', () => { 
      this.connectionState.next('disconnected'); 
      console.log('disconnected')
    });
  }

  ngOnDestroy() {
    console.log('destroying socket')
    this.socket.disconnect();
  }

  connect() {
    if (!this.socket.connected) {
      console.log('socket connecting')
      this.socket.connect();
    } else {
      console.log('socket already connected')
    }
  }
}
