import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Message, ServerConnectionState, SocketService } from '../../services/socket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { MessageComponent } from '../message/message.component';
import { ChatHeaderComponent } from "../chat-header/chat-header.component";
import { ChatFooterComponent } from "../chat-footer/chat-footer.component";
import { ChatMessagesComponent } from "../chat-messages/chat-messages.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    imports: [ChatHeaderComponent, ChatFooterComponent, ChatMessagesComponent]
})
export class AppComponent {}
