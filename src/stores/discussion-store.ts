import { action, mst, shim } from 'classy-mst'
import { getEnv, Instance, types } from 'mobx-state-tree'
// import { loadString, saveString } from '../../components/storage'
import { formError } from '../../components/utils/error-utils'
import { Environment } from '../app/environment'
import { DiscussionTopic } from '../services/api'
import { T } from '../style/values'

// tslint:disable-next-line:variable-name
const DiscussionStoreData = types.model({
  discussionList: types.array(types.frozen<DiscussionTopic>()),
  nextPageToken: types.optional(types.string, '')
})

class DiscussionActions extends shim(DiscussionStoreData) {
  // @ts-ignore
  private get env() {
    return getEnv(this) as Environment
  }

  public async fetchDiscussionList() {
    try {
      const data = await this.env.api.discussions.discussionTopicsList(null, 7)

      if (data.data.next) {
        this.setNextPageToken(data.data.next)
      }
      this.setDiscussionList(data.data.results)
    } catch (error) {
      console.tron.log(`DiscussionList error: ${JSON.stringify(error)}`)
      throw formError(error, T.string.get_note_list_error)
    }
  }

  public async fetchNextPageDiscussionList() {
    if (!this.nextPageToken) {
      return
    }

    const token = this.nextPageToken

    this.setNextPageToken('')

    const data = await this.env.api.discussions.discussionTopicsList(token, 7)

    this.setNextPageToken(data.data.next || '')
    this.updateDiscussionList(data.data.results)
  }

  @action
  public setNextPageToken(nextPageToken?: string) {
    this.nextPageToken = nextPageToken
  }

  @action
  public setDiscussionList(discussionList: DiscussionTopic[]) {
    this.discussionList.clear()

    discussionList.forEach(item => {
      this.discussionList.push({ ...item })
    })
  }

  @action
  public updateDiscussionList(discussionList: DiscussionTopic[]) {
    discussionList.forEach(item => {
      this.discussionList.push({ ...item })
    })
  }

  // @action
  // private setNewDiscussion(note: Discussion) {
  //   this.noteList.unshift({ ...note })
  // }
  //
  // @action
  // private setUpdatingDiscussion(note: Discussion) {
  //   const updatedDiscussionPosition = this.noteList.findIndex(
  //     item => item.id === note.id,
  //   )
  //   if (updatedDiscussionPosition >= 0) {
  //     this.noteList[updatedDiscussionPosition] = { ...note }
  //   }
  // }
  //
  // @action
  // private deleteDiscussionFromList(note: Discussion) {
  //   this.noteList.remove(note)
  // }
}

// tslint:disable-next-line:variable-name
export const DiscussionStoreModel = mst(DiscussionActions, DiscussionStoreData, 'DiscussionStore')

export type DiscussionStore = Instance<typeof DiscussionStoreModel>
