import { action, mst, shim } from 'classy-mst'
import { getEnv, Instance, types } from 'mobx-state-tree'
// import { loadString, saveString } from '../../components/storage'
import { formError } from '../../components/utils/error-utils'
import { Environment } from '../app/environment'
import { Chat, Message } from '../services/api'
import { T } from '../style/values'
import { IMessage } from 'react-native-gifted-chat'

// tslint:disable-next-line:variable-name
const ChatStoreData = types.model({
  messageList: types.array(types.frozen<Message>()),
  nextPageToken: types.optional(types.string, ''),
  chatId: types.optional(types.number, 1),
})

class ChatActions extends shim(ChatStoreData) {
  // @ts-ignore
  private get env() {
    return getEnv(this) as Environment
  }

  public async fetchChatList() {
    try {
      // const options = { query: { page_size: 7 } } as any
      const data = await this.env.api.chats.chatsMessages(
        this.chatId.toString(),
      )
      if (data.data.next) {
        this.setNextPageToken(data.data.next)
      }
      this.setMessageList(data.data.results)
      return data.data.results
    } catch (error) {
      console.tron.log(`ChatList error: ${JSON.stringify(error)}`)
      throw formError(error, T.string.get_note_list_error)
    }
  }

  public async fetchNextPageChatList() {
    if (!this.nextPageToken) {
      return
    }

    const options = {
      query: {
        page_size: 7,
        maxid: this.nextPageToken,
      },
    } as any

    this.setNextPageToken('')

    const data = await this.env.api.chats.chatsMessages(options)

    this.setNextPageToken(data.data.next || '')
    this.updateChatList(data.data.results)

    return data.data.results
  }

  @action
  public setNextPageToken(nextPageToken?: string) {
    this.nextPageToken = nextPageToken
  }

  @action
  public setCurrentChat(chatId: number) {
    this.chatId = chatId
    this.nextPageToken = ''
    this.messageList.clear()
  }

  @action
  public setMessageList(messageList: Message[]) {
    this.messageList.clear()

    messageList.forEach(item => {
      this.messageList.push({ ...item })
    })
  }

  @action
  public updateChatList(messageList: Message[]) {
    messageList.forEach(item => {
      this.messageList.push({ ...item })
    })
  }

  // TODO: Cover the "Message not sent" case
  // TODO: Get rid of the chat-store in favour of content-store
  public async sendMessages(messages: IMessage[]) {
    const newMessages = [] as Message[]
    // tslint:disable-next-line:prefer-for-of no-increment-decrement
    for (let i = 0; i < messages.length; i++) {
      const newMessage = await this.env.api.messages.messagesCreate({
        chat: this.chatId,
        text: messages[i].text,
        dateCreated: new Date().toISOString(),
      })
      newMessages.push(newMessage.data)
    }
    this.updateChatList(newMessages)
    return newMessages
  }
}

// tslint:disable-next-line:variable-name
export const ChatStoreModel = mst(ChatActions, ChatStoreData, 'ChatStore')

export type ChatStore = Instance<typeof ChatStoreModel>
