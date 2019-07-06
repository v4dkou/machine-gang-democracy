import { createContentStore } from '../../components/content-store'
import { ConnectionError } from '../../components/utils/error-utils'
import { DiscussionStore } from '../stores/discussion-store'

export class DiscussionListViewModel {
  public discussionListRequest = createContentStore<void, ConnectionError>()

  constructor(private readonly discussionStore: DiscussionStore) {
    this.loadDiscussionList()
  }

  public loadDiscussionList = () => {
    this.discussionListRequest.setLoading()

    this.discussionStore
      .fetchDiscussionList()
      .then(this.discussionListRequest.setData)
      .catch(this.discussionListRequest.setError)
  }
}
