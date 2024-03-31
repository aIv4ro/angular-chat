import { Component, OnInit } from '@angular/core';
import { ServerConnectionState, SocketService } from '../../services/socket.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'chat-footer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat-footer.component.html',
  styles: `textarea {field-sizing: content;}`,
})
export class ChatFooterComponent implements OnInit {
  connectionState: ServerConnectionState = 'disconnected';
  message: string = '';

  constructor (
    private readonly socketService: SocketService
  ) {}

  ngOnInit() {
    this.socketService.connectionState.subscribe(connectionState => {
      this.connectionState = connectionState;
    })
  }

  sendMessage() {
    this.socketService.sendMessage(this.message);
    this.message = '';
  }
}
