import { action, mst, shim } from 'classy-mst'
import { getEnv, Instance, types } from 'mobx-state-tree'
// import { loadString, saveString } from '../../components/storage'
import { formError } from '../../components/utils/error-utils'
import { Environment } from '../app/environment'
import { DiscussionTopic, Initiative } from '../services/api'
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

  public async createDiscussion(description: string): Promise<DiscussionTopic> {
    try {
      let data = await this.env.api.initiatives.initiativesCreate({
        topic: {
          description
        },
        problemDescription: description,
        solutionDescription: 'Возможное решение вопроса'
      } as Initiative)

      this.setNewDiscussion(data.data.topic)
      return data.data.topic
    } catch (error) {
      console.tron.log("Create discussion error: " + JSON.stringify(error))
      return Promise.reject(formError(error, T.string.write_note_error))
    }
  }

  // updateDiscussion(id: number, description: string): Promise<DiscussionTopic> {
  //     return new Promise<DiscussionTopic>((resolve, reject) => {
  //             try {
  //                 this.env.api.discussions..write(() => {
  //                     const newDiscussion = this.env.realm.create('DiscussionTopic', {id, description} as DiscussionTopic, true)
  //                     resolve(newDiscussion)
  //                 })
  //             } catch (error) {
  //                 reject(error)
  //             }
  //         })
  //         .then(data => {
  //             this.setUpdatingD(data)
  //             return Promise.resolve(data)
  //         })
  //         .catch(error => {
  //             console.tron.log("Update note error: " + JSON.stringify(error))
  //             return Promise.reject(formError(error, T.string.update_note_error))
  //         })
  // }

  // deleteNote(note: Note): Promise<void> {
  //     return timer(2000)
  //         .then(() => new Promise<Note>((resolve, reject) => {
  //             try {
  //                 this.env.realm.write(() => {
  //                     const realmNote = this.env.realm.objectForPrimaryKey('Note', note.id)
  //                     if (realmNote) {
  //                         this.env.realm.delete(realmNote)
  //                         resolve()
  //                     } else {
  //                         reject(new Error('Failed to delete Note with id: ' + note.id))
  //                     }
  //                 })
  //             } catch (error) {
  //                 reject(error)
  //             }
  //         }))
  //         .then(() => {
  //             this.deleteNoteFromList(note)
  //             return Promise.resolve()
  //         })
  //         .catch(error => {
  //             return Promise.reject(formError(error, T.string.delete_note_error))
  //         })
  // }

  @action
  private setNewDiscussion(discussion: DiscussionTopic) {
      this.discussionList.unshift({...discussion})
  }

  @action
  private setUpdatingDiscussion(discussion: DiscussionTopic) {
      const updatedDiscussionPosition = this.discussionList.findIndex(item => item.id === discussion.id)
      if (updatedDiscussionPosition >= 0) {
          this.discussionList[updatedDiscussionPosition] = {...discussion}
      }
  }

  @action
  private deleteDiscussionTopicFromList(discussion: DiscussionTopic) {
      this.discussionList.remove(discussion)
  }
}

// tslint:disable-next-line:variable-name
export const DiscussionStoreModel = mst(DiscussionActions, DiscussionStoreData, 'DiscussionStore')

export type DiscussionStore = Instance<typeof DiscussionStoreModel>
