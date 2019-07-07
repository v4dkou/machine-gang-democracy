import { action, computed, observable } from 'mobx'
import { createContentStore } from '../../components/content-store'
import { FormField, validate } from '../../components/fields/form-field'
import { StringEmptyOptions } from '../../components/fields/string-options'
import { ConnectionError } from '../../components/utils/error-utils'
import { DiscussionTopic } from '../services/api/api'
import { DiscussionStore } from '../stores/discussion-store'
import { T } from '../style/values'

export class DiscussionViewModel {
  @observable
  public discussionId: number

  public readonly description = new FormField(
    new StringEmptyOptions(T.string.empty_description_text),
  )

  public readonly saveDiscussionRequest = createContentStore<DiscussionTopic, ConnectionError>()
  public readonly deleteDiscussionRequest = createContentStore<
    void,
    ConnectionError
  >()

  constructor(private readonly discussionStore: DiscussionStore, discussionId: number) {
    this.discussionId = discussionId
    this.updateDiscussionData()
  }

  @computed get discussion(): DiscussionTopic {
    if (this.discussionId === undefined || this.discussionId === null) return null

    return this.discussionStore.discussionList.find(item => item.id === this.discussionId)
  }

  public setDescription = (description: string) => {
    this.description.setData(description)
  }

  public savePressed = () => {
    if (validate(this.description)) {
      let savePromise
      if (this.discussionId) {
        if (
          this.description.data === this.discussion.description
        ) {
          this.description.setError(T.string.no_changes_note_error)
          return
        }

        // savePromise = this.discussionStore.updateDiscussion(
        //   this.discussionId,
        //   this.description.data,
        // )
      } else {
        savePromise = this.discussionStore.createDiscussion(
          this.description.data,
        )
      }

      this.saveDiscussionRequest.setLoading()

      savePromise
        .then(this.saveDiscussionRequest.setData)
        .catch(this.saveDiscussionRequest.setError)
    }
  }

  // public deletePressed = () => {
  //   this.deleteDiscussionRequest.setLoading()
  //
  //   this.discussionStore
  //     .deleteDiscussionTopic(this.discussion)
  //     .then(this.deleteDiscussionRequest.setData)
  //     .catch(this.deleteDiscussionRequest.setError)
  // }

  @action
  public updateDiscussionId(discussionId: number) {
    this.discussionId = discussionId
  }

  public updateDiscussionData() {
    if (this.discussion) {
      this.description.setData(this.discussion.description)
    }
  }
}
