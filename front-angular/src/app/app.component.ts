import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Message, ServerConnectionState, SocketService } from './services/socket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MessageComponent } from './components/message/message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, MessageComponent],
  templateUrl: './app.component.html',
  styles: `textarea {field-sizing: content;}`
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();

  connectionState: ServerConnectionState = 'disconnected';
  messages: Message[] = [];
  message: string = '';
  username: string = '';

  constructor(  
    private readonly socketService: SocketService,
  ) {}

  ngOnInit() {
    this.socketService.connectionState  
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: value => {
          this.connectionState = value;
        }
      })

    this.socketService.messages
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: value => {
          console.log('new messages', value)
          this.messages = [...value];
        }
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  connect() {
    this.socketService.connect({ username: this.username });
  }

  disconnect() {
    this.socketService.disconnect();
  }

  sendMessage() {
    this.socketService.sendMessage(this.message);
    this.message = '';
  }
}
