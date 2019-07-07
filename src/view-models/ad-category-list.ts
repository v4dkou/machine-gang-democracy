import { createContentStore } from '../../components/content-store'
import { ConnectionError } from '../../components/utils/error-utils'
import { AdCategoryStore } from '../stores/ad-categories-store'

export class AdCategoryListViewModel {
  public adCategoryListRequest = createContentStore<void, ConnectionError>()

  constructor(private readonly adCategoryStore: AdCategoryStore) {
    this.loadAdCategoryList()
  }

  public loadAdCategoryList = () => {
    this.adCategoryListRequest.setLoading()

    console.tron.log('loadAdCategoryList')

    this.adCategoryStore
      .fetchAdCategoryList()
      .then(this.adCategoryListRequest.setData)
      .catch(this.adCategoryListRequest.setError)
  }
}
