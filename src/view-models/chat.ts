import { IMessage } from 'react-native-gifted-chat'
import { createContentStore } from '../../components/content-store'
import { ConnectionError } from '../../components/utils/error-utils'
import { Message } from '../services/api'
import { ChatStore } from '../stores/chat-store'

export class ChatViewModel {
  public chatRequest = createContentStore<IMessage[], ConnectionError>()

  constructor(
    private readonly chatStore: ChatStore,
    private readonly chatId: number,
  ) {
    this.chatStore.setCurrentChat(this.chatId)
    this.loadDiscussionList()
  }

  public loadDiscussionList = () => {
    this.chatRequest.setLoading()

    this.chatStore
      .fetchChatList()
      .then(this.mapMessagesToView)
      .then(this.concatMessages)
      .then(this.chatRequest.setData)
      .catch(this.chatRequest.setError)
  }

  private mapMessagesToView = (item: Message[]): IMessage[] =>
    item.map(this.mapMessageToView)

  private mapMessageToView = (item: Message): IMessage => {
    return {
      _id: item.id,
      text: item.text,
      createdAt: Date.parse(item.dateCreated),
      user: {
        _id: item.user.id,
        name: item.user.username,
      },
    }
  }

  private concatMessages = (items: IMessage[]) => {
    return this.chatRequest.data && this.chatRequest.data.length > 0
      ? [...items, ...this.chatRequest.data]
      : items
  }

  public loadNextPage = () => {
    this.chatStore
      .fetchNextPageChatList()
      .then(this.mapMessagesToView)
      .then(this.chatRequest.setData)
      .catch(this.chatRequest.setError)
  }

  public sendMessages = async (messages: IMessage[]) => {
    const newMessages = await this.chatStore.sendMessages(messages)
    const converted = this.mapMessagesToView(newMessages)
    this.chatRequest.setData(this.concatMessages(converted))
  }
}
