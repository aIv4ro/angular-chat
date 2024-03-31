import { createServer } from 'http'
import { Server } from 'socket.io'
import { UserData, deleteId, getInMemoUsers, register } from './services/users'
import { Message, addMessage, getInMemoMessages } from './services/messages'

const port = process.env.PORT ?? 8080

const server = createServer()

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log('connect -> socket.id ->', socket.id)
  const data = socket.handshake.auth as UserData
  register({ id: socket.id, socket, data })
  socket.emit('old-messages', getInMemoMessages())

  socket.on('disconnect', () => {
    console.log('disconnect -> socket.id ->', socket.id)
    const user = getInMemoUsers().find((user) => user.id === socket.id)
    if (user != null) {
      deleteId(socket.id)
    }
  })

  socket.on('message', (text: string) => {
    console.log('message -> text ->', text)
    const user = getInMemoUsers().find((user) => user.id === socket.id)
    if (user != null) {
      const message: Message = { from: user.data.username, text }
      addMessage(message)
      getInMemoUsers()
        .forEach(({ socket }) => {
          socket.emit('message', message)
        })
    }
  })
})

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
