import { Component, OnInit } from '@angular/core';
import { ServerConnectionState, SocketService } from '../../services/socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileInputValueAccessor } from '../../directives/file-input-value-accessor.directive';
import { ToSrcPipe } from "../../pipes/to-src.pipe";

@Component({
    selector: 'chat-footer',
    standalone: true,
    templateUrl: './chat-footer.component.html',
    styles: `textarea {field-sizing: content;}`,
    imports: [FormsModule, CommonModule, FileInputValueAccessor, ToSrcPipe]
})
export class ChatFooterComponent implements OnInit {
  connectionState: ServerConnectionState = 'disconnected';
  message: string = '';
  image: File | null = null;

  constructor (
    private readonly socketService: SocketService
  ) {}

  ngOnInit() {
    this.socketService.connectionState.subscribe(connectionState => {
      this.connectionState = connectionState;
    })
  }

  sendMessage($event: SubmitEvent) {
    const obj = {
      message: this.message,
      image: this.image
    }
    this.socketService.sendMessage(obj);
    const form = $event.target as HTMLFormElement;
    form.reset();
    this.message = '';
  }
}

