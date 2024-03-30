import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Message, SocketService } from '../../services/socket.service';
import { CommonModule } from '@angular/common';
import { Subject, filter, takeUntil } from 'rxjs';
import { TailComponent } from '../tail/tail.component';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, TailComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit, OnDestroy {
  @Input() message!: Message;
  username: string | null = null;
  private readonly ngUnsubscribe$ = new Subject<void>();

  constructor(
    private readonly socketService: SocketService
  ) {}

  ngOnInit() {
    this.socketService.username
      .pipe(
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(username => this.username = username)
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
