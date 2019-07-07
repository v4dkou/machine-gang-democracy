import { action, mst, shim } from 'classy-mst'
import { getEnv, Instance, types } from 'mobx-state-tree'
// import { loadString, saveString } from '../../components/storage'
import { formError } from '../../components/utils/error-utils'
import { Environment } from '../app/environment'
import { Chat } from '../services/api'
import { T } from '../style/values'

// tslint:disable-next-line:variable-name
const ChatStoreData = types.model({
  chatList: types.array(types.frozen<Chat>()),
  nextPageToken: types.optional(types.string, ''),
})

class ChatActions extends shim(ChatStoreData) {
  // @ts-ignore
  private get env() {
    return getEnv(this) as Environment
  }

  public async fetchChatList() {
    try {
      // const options = { query: { page_size: 7 } } as any
      // const data = await this.env.api.messages.(options)
      // if (data.data.next) {
      //   this.setNextPageToken(data.data.next)
      // }
      // this.setChatList(data.data.results)
      return [
        {
          _id: 1,
          createdAt: 1,
          text: 'Согласна! Пора бы уже!',
          user: {
            _id: 1,
            avatar: 'https://avatars1.githubusercontent.com/u/29154528?s=460&v=4'
          },
        },
      ]
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

    console.tron.log(JSON.stringify(options))

    // const data = await this.env.api.messages.discussionTopicsList(options)

    // this.setNextPageToken(data.data.next || '')
    // this.updateChatList(data.data.results)
  }

  @action
  public setNextPageToken(nextPageToken?: string) {
    this.nextPageToken = nextPageToken
  }

  @action
  public setChatList(chatList: Chat[]) {
    this.chatList.clear()

    chatList.forEach(item => {
      this.chatList.push({ ...item })
    })
  }

  @action
  public updateChatList(chatList: Chat[]) {
    chatList.forEach(item => {
      this.chatList.push({ ...item })
    })
  }

  // @action
  // private setNewChat(note: Chat) {
  //   this.noteList.unshift({ ...note })
  // }
  //
  // @action
  // private setUpdatingChat(note: Chat) {
  //   const updatedChatPosition = this.noteList.findIndex(
  //     item => item.id === note.id,
  //   )
  //   if (updatedChatPosition >= 0) {
  //     this.noteList[updatedChatPosition] = { ...note }
  //   }
  // }
  //
  // @action
  // private deleteChatFromList(note: Chat) {
  //   this.noteList.remove(note)
  // }
}

// tslint:disable-next-line:variable-name
export const ChatStoreModel = mst(ChatActions, ChatStoreData, 'ChatStore')

export type ChatStore = Instance<typeof ChatStoreModel>
