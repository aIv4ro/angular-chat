export interface Message {
  from: 'server' | string
  text: string
}

const inMemoMessages: Message[] = []

export const getInMemoMessages = (): Message[] => inMemoMessages

export const addMessage = (message: Message): void => {
  inMemoMessages.push(message)
}

export const printInMemoMessages = (): void => {
  console.log('inMemoMessages ->', inMemoMessages)
}
