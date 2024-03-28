import { Socket } from 'socket.io'

export interface UserData {
  username: string
}
interface User {
  id: string
  data: UserData | null
  socket: Socket
}

const inMemoUsers: User[] = []

export const getInMemoUsers = (): User[] => inMemoUsers

export const registerId = ({ id, socket }: { id: string, socket: Socket }): void => {
  const user = { id, socket, data: null }
  inMemoUsers.push(user)
}

export const deleteId = (id: string): void => {
  const index = inMemoUsers.findIndex((user) => user.id === id)
  if (index !== -1) {
    inMemoUsers.splice(index, 1)
  }
}

export const setUserData = ({ id, data }: { id: string, data: UserData }): void => {
  const index = inMemoUsers.findIndex((user) => user.id === id)
  if (index !== -1) {
    inMemoUsers[index].data = data
  }
}

export const printInMemoUsers = (): void => {
  console.log('inMemoUsers ->', inMemoUsers.map((user) => user.id))
}
