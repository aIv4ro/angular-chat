import { createServer } from 'http'
import { Server } from 'socket.io'

const port = process.env.PORT ?? 8080

const server = createServer()

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log('new socket connection')
})

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
