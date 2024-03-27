import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

const port = process.env.PORT ?? 8080

const server = createServer()

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
})

interface User {
  id: string
  data: {} | null
  socket: Socket
}

const inMemoUsers: User[] = []

const registerId = ({ id, socket }: { id: string, socket: Socket }): void => {
  const user = { id, socket, data: null }
  inMemoUsers.push(user)
}

const deleteId = (id: string): void => {
  const index = inMemoUsers.findIndex((user) => user.id === id)
  if (index !== -1) {
    inMemoUsers.splice(index, 1)
  }
}

const setUserData = ({ id, data }: { id: string, data: {} }): void => {
  const index = inMemoUsers.findIndex((user) => user.id === id)
  if (index !== -1) {
    inMemoUsers[index].data = data
  }
}

const printInMemoUsers = (): void => {
  console.log('inMemoUsers ->', inMemoUsers.map((user) => user.id))
}

io.on('connection', (socket) => {
  console.log('connect -> socket.id ->', socket.id)
  registerId({ id: socket.id, socket })
  printInMemoUsers()

  socket.on('disconnect', () => {
    console.log('disconnect -> socket.id ->', socket.id)
    deleteId(socket.id)
    printInMemoUsers()
  })

  socket.on('join', data => {
    console.log('join -> data ->', data)
    setUserData({ id: socket.id, data })
    socket.emit('joined', '')
    printInMemoUsers()
  })
})

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
