import { createContentStore } from '../../components/content-store'
import { ConnectionError } from '../../components/utils/error-utils'
import { ChatStore } from '../stores/chat-store'
import { IMessage } from 'react-native-gifted-chat'

export class ChatViewModel {
  public chatRequest = createContentStore<IMessage[], ConnectionError>()

  constructor(private readonly chatStore: ChatStore) {
    this.loadDiscussionList()
  }

  public loadDiscussionList = () => {
    this.chatRequest.setLoading()

    this.chatStore
      .fetchChatList()
      .then(this.chatRequest.setData)
      .catch(this.chatRequest.setError)
  }

  public loadNextPage = () => {
    this.chatStore
      .fetchNextPageChatList()
      .then(this.chatRequest.setData)
      .catch(this.chatRequest.setError)
  }

  public sendMessages = (messages: IMessage[]) => {}
}
