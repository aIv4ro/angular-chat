import { Component, OnDestroy, OnInit } from '@angular/core';
import { ServerConnectionState, SocketService } from '../../services/socket.service';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../../services/local-storage.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'chat-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat-header.component.html',
})
export class ChatHeaderComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();

  username: string = '';
  connectionState: ServerConnectionState = 'disconnected';

  constructor(
    private readonly socketService: SocketService,
    private readonly localStorageService: LocalStorageService
  ) {
    this.username = this.localStorageService.getConnection()?.username ?? '';
  }

  ngOnInit() {
    this.socketService.connectionState
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(connectionState => {
        this.connectionState = connectionState;
      });
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
}
