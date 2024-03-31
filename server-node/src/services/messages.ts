export interface Message {
  from: 'server' | string
  text: string
}

const inMemoMessages: Message[] = []

export const getInMemoMessages = ({
  limit
}: {
  limit: number
} = {
  limit: 10
}): Message[] => {
  return inMemoMessages.slice(-limit)
}

export const addMessage = (message: Message): void => {
  inMemoMessages.push(message)
}

export const printInMemoMessages = (): void => {
  console.log('inMemoMessages ->', inMemoMessages)
}
