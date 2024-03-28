import { createServer } from 'http'
import { Server } from 'socket.io'
import { UserData, deleteId, getInMemoUsers, printInMemoUsers, registerId, setUserData } from './services/users'

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
        getInMemoUsers()
          .forEach(({ socket }) => {
            socket.emit('message', {
              from: 'server',
              message: `${data.username} has left the chat!`
            })
          })
      }
    }
  })

  socket.on('join', (data: UserData) => {
    console.log('join -> data ->', data)
    setUserData({ id: socket.id, data })
    socket.emit('joined')
    getInMemoUsers()
      .forEach(({ socket }) => {
        socket.emit('message', {
          from: 'server',
          message: `${data.username} has joined the chat!`
        })
      })
  })
})

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
