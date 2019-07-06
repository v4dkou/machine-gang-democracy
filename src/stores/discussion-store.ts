import { action, mst, shim } from 'classy-mst'
import { getEnv, Instance, types } from 'mobx-state-tree'
// import { loadString, saveString } from '../../components/storage'
import { formError } from '../../components/utils/error-utils'
import promiseTimer from '../../components/utils/promise-timer'
import { Environment } from '../app/environment'
import { Discussion } from '../services/api/discussion'
import { T } from '../style/values'

// tslint:disable-next-line:variable-name
const DiscussionStoreData = types.model({
  discussionList: types.array(types.frozen<Discussion>()),
})

// tslint:disable-next-line:variable-name
const DemoDiscussion = {
  id: 11,
  title: 'Title',
  description: 'Description',
} as Discussion

class DiscussionActions extends shim(DiscussionStoreData) {
  // @ts-ignore
  private get env() {
    return getEnv(this) as Environment
  }

  public async fetchDiscussionList() {
    try {
      await this.env.fcm.requestPermission()
      const token = await this.env.fcm.getToken()
      console.warn(JSON.stringify(token))
      await promiseTimer(2000)
      this.setDiscussionList([DemoDiscussion])
    } catch (error) {
      console.tron.log(`DiscussionList error: ${JSON.stringify(error)}`)
      throw formError(error, T.string.get_note_list_error)
    }
  }

  @action
  public setDiscussionList(discussionList: Discussion[]) {
    this.discussionList.clear()
    discussionList.forEach(item => {
      this.discussionList.unshift({ ...item })
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
