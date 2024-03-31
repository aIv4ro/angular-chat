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
  const data = socket.handshake.auth as UserData | null
  if (data == null) {
    socket.disconnect()
    return
  } else {
    register({ id: socket.id, socket, data })
    const joinMessage: Message = { from: 'server', text: `${data.username} has joined the chat!` }
    addMessage(joinMessage)
    socket.emit('old-messages', getInMemoMessages())
    getInMemoUsers()
      .filter((user) => user.id !== socket.id)
      .forEach(({ socket }) => {
        socket.emit('message', joinMessage)
      })
  }

  socket.on('disconnect', () => {
    console.log('disconnect -> socket.id ->', socket.id)
    const user = getInMemoUsers().find((user) => user.id === socket.id)
    if (user != null) {
      deleteId(socket.id)
      const { data } = user
      if (data != null) {
        const leaveMessage: Message = {
          from: 'server',
          text: `${data?.username} has left the chat!`
        }
        addMessage(leaveMessage)
        getInMemoUsers()
          .forEach(({ socket }) => {
            socket.emit('message', leaveMessage)
          })
      }
    }
  })

  socket.on('message', (text: string) => {
    console.log('message -> text ->', text)
    const user = getInMemoUsers().find((user) => user.id === socket.id)
    if (user != null) {
      const message: Message = {
        from: user.data?.username ?? user.id,
        text
      }
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
