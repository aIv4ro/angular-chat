import { Component, Input } from '@angular/core'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { type Message, SocketService } from '../../services/socket.service'
import { CommonModule } from '@angular/common'
import { TailComponent } from '../tail/tail.component'

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, TailComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  @Input() message!: Message
  username: string | null = null

  constructor (
    private readonly socketService: SocketService
  ) {
    this.username = this.socketService.getAuthUsername()
  }
}
