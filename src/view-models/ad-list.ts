import { createContentStore } from '../../components/content-store'
import { ConnectionError } from '../../components/utils/error-utils'
import { AdStore } from '../stores/ad-store'

export class AdListViewModel {
  public adListRequest = createContentStore<void, ConnectionError>()

  constructor(private readonly adStore: AdStore, public readonly subcategoryId: string) {
    this.loadAdList()
  }

  public loadAdList = () => {
    this.adListRequest.setLoading()

    this.adStore
      .fetchAdList(this.subcategoryId)
      .then(this.adListRequest.setData)
      .catch(this.adListRequest.setError)
  }
}
