import { action, computed, observable } from 'mobx'
import { createContentStore } from '../../components/content-store'
import { FormField, validate } from '../../components/fields/form-field'
import { StringEmptyOptions } from '../../components/fields/string-options'
import { ConnectionError } from '../../components/utils/error-utils'
import { Note } from '../services/database/schemas/discussion'
import { DiscussionStore } from '../stores/discussion-store'
import { T } from '../style/values'

export class DiscussionViewModel {
  @observable
  public discussionId: number

  public readonly title = new FormField(
    new StringEmptyOptions(T.string.empty_title_text),
  )
  public readonly description = new FormField(
    new StringEmptyOptions(T.string.empty_description_text),
  )

  public readonly saveNoteRequest = createContentStore<Note, ConnectionError>()
  public readonly deleteNoteRequest = createContentStore<
    void,
    ConnectionError
  >()

  constructor(private readonly discussionStore: DiscussionStore, discussionId: number) {
    this.discussionId = discussionId
    this.updateNoteData()
  }

  @computed get discussion(): Note {
    if (this.discussionId === undefined || this.discussionId === null) return null

    return this.discussionStore.discussionList.find(item => item.id === this.discussionId)
  }

  public setTitle = (title: string) => {
    this.title.setData(title)
  }

  public setDescription = (description: string) => {
    this.description.setData(description)
  }

  // public savePressed = () => {
  //   if (validate(this.title, this.description)) {
  //     let savePromise
  //     if (this.discussionId) {
  //       if (
  //         this.title.data === this.discussion.title &&
  //         this.description.data === this.discussion.description
  //       ) {
  //         this.title.setError(T.string.no_changes_discussion_error)
  //         return
  //       }
  //
  //       savePromise = this.discussionStore.updateDiscussion(
  //         this.discussionId,
  //         this.title.data,
  //         this.description.data,
  //       )
  //     } else {
  //       savePromise = this.discussionStore.createDiscussion(
  //         this.title.data,
  //         this.description.data,
  //       )
  //     }
  //
  //     this.saveNoteRequest.setLoading()
  //
  //     savePromise
  //       .then(this.saveNoteRequest.setData)
  //       .catch(this.saveNoteRequest.setError)
  //   }
  // }

  // public deletePressed = () => {
  //   this.deleteNoteRequest.setLoading()
  //
  //   this.discussionStore
  //     .deleteNote(this.discussion)
  //     .then(this.deleteNoteRequest.setData)
  //     .catch(this.deleteNoteRequest.setError)
  // }

  @action
  public updateNoteId(discussionId: number) {
    this.discussionId = discussionId
  }

  public updateNoteData() {
    if (this.discussion) {
      this.title.setData(this.discussion.title)
      this.description.setData(this.discussion.description)
    }
  }
}
