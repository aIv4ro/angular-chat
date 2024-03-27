import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServerConnectionState, SocketService } from './services/socket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styles: `textarea {field-sizing: content;}`
})
export class AppComponent implements OnInit {
  connectionState: ServerConnectionState = 'disconnected';
  message: string = '';
  username: string = '';

  constructor(  
    private readonly socketService: SocketService,
  ) {}

  ngOnInit() {
    this.socketService.connectionState.subscribe({
      next: value => {
        this.connectionState = value;
      }
    })
  }

  connect() {
    this.socketService.connect({ username: this.username });
  }

  disconnect() {
    this.socketService.disconnect();
  }
}
