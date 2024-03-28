import { createServer } from 'http'
import { Server } from 'socket.io'
import { UserData, deleteId, getInMemoUsers, printInMemoUsers, registerId, setUserData } from './services/users'
import { Message, addMessage, getInMemoMessages, printInMemoMessages } from './services/messages'

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
  registerId({ id: socket.id, socket })
  printInMemoUsers()

  socket.on('disconnect', () => {
    console.log('disconnect -> socket.id ->', socket.id)
    const user = getInMemoUsers().find((user) => user.id === socket.id)
    if (user != null) {
      deleteId(socket.id)
      printInMemoUsers()
      const { data } = user
      if (data != null) {
        const leaveMessage: Message = {
          from: 'server',
          text: `${data?.username} has left the chat!`
        }
        addMessage(leaveMessage)
        printInMemoMessages()
        getInMemoUsers()
          .forEach(({ socket }) => {
            socket.emit('message', leaveMessage)
          })
      }
    }
  })

  socket.on('join', (data: UserData) => {
    console.log('join -> data ->', data)
    setUserData({ id: socket.id, data })
    socket.emit('joined')
    const joinMessage: Message = {
      from: 'server',
      text: `${data.username} has joined the chat!`
    }
    addMessage(joinMessage)
    printInMemoMessages()
    socket.emit('old-messages', getInMemoMessages())
    getInMemoUsers()
      .filter((user) => user.id !== socket.id)
      .forEach(({ socket }) => {
        socket.emit('message', joinMessage)
      })
  })

  socket.on('message', (text: string) => {
    console.log('message -> text ->', text)
    const user = getInMemoUsers().find((user) => user.id === socket.id)
    if (user != null) {
      const message: Message = {
        from: user.id,
        text
      }
      addMessage(message)
      printInMemoMessages()
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
