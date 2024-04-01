import { createServer } from 'http'
import { Server } from 'socket.io'
import { UserData, deleteId, getInMemoUsers, register } from './services/users'
import { Message, addMessage, getInMemoMessages } from './services/messages'
import { randomUUID } from 'crypto'
import { readFile, writeFile } from 'fs/promises'
import { readdirSync, unlinkSync } from 'fs'
import path from 'path'

type FileFromTypeBufferReturn = Promise<ReturnType<Awaited<typeof import('file-type')>['fromBuffer']>>
const fileTypeFromBuffer = async (buffer: Buffer): FileFromTypeBufferReturn => {
  const { fromBuffer } = await import('file-type')
  const fileType = await fromBuffer(buffer)
  return fileType
}

const imagesFolder = './public/tmp/images'
const port = process.env.PORT ?? 8080

const imageUrlMatcher = /^\/public\/tmp\/images\/([a-z0-9-]+)\.(png|jpg|jpeg|gif|webp)$/
const server = createServer((req, res) => {
  const { url } = req
  if (url == null) return
  const imageMatch = url.match(imageUrlMatcher)
  if (imageMatch != null) {
    const [, id, ext] = imageMatch;
    (async function (): Promise<void> {
      const image = await readFile(`${imagesFolder}/${id}.${ext}`)
      res.writeHead(200, { 'Content-Type': `image/${ext}` })
      res.end(image)
    })().then().catch(console.error)
  }
})

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
      const message: Message = { from: user.data.username, text, image: null }
      addMessage(message)
      getInMemoUsers()
        .forEach(({ socket }) => {
          socket.emit('message', message)
        })
    }
  })

  socket.on('upload', async (image: Buffer, text: string) => {
    console.log('upload -> message ->', text, 'image ->', image)
    const user = getInMemoUsers().find((user) => user.id === socket.id)
    if (user != null) {
      const idForImage = randomUUID()
      const fileType = await fileTypeFromBuffer(image)
      if (fileType == null) return
      await writeFile(`./public/tmp/images/${idForImage}.${fileType.ext}`, image)
      const message: Message = { from: user.data.username, text, image: `${idForImage}.${fileType.ext}` }
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

const exitEvents = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'] as const

exitEvents.forEach((eventType) => {
  process.on(eventType, () => {
    console.log('closing server')
    const files = readdirSync(imagesFolder)
    files.forEach((file) => {
      unlinkSync(path.join(imagesFolder, file))
    })
  })
})
