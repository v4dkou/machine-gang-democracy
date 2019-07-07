import { action, mst, shim } from 'classy-mst'
import { getEnv, Instance, types } from 'mobx-state-tree'
// import { loadString, saveString } from '../../components/storage'
import { formError } from '../../components/utils/error-utils'
import { Environment } from '../app/environment'
import { AdvertisementCategory } from '../services/api/api'
import { T } from '../style/values'

// tslint:disable-next-line:variable-name
const AdCategoryStoreData = types.model({
  adCategoryList: types.array(types.frozen<AdvertisementCategory>())
})

class AdCategoryActions extends shim(AdCategoryStoreData) {
  // @ts-ignore
  private get env() {
    return getEnv(this) as Environment
  }

  public async fetchAdCategoryList() {
    try {
      const data = await this.env.api.advertisementCategories.advertisementCategoriesList()

      this.setAdCategoryList(data.data)
    } catch (error) {
      console.tron.log(`AdCategoryList error: ${error.toString()}: ${JSON.stringify(error)}`)
      throw formError(error, T.string.get_note_list_error)
    }
  }

  @action
  public setAdCategoryList(adCategoryList: AdvertisementCategory[]) {
    this.adCategoryList.clear()
    adCategoryList.forEach(item => {
      this.adCategoryList.push({ ...item })
    })
  }

  // @action
  // private setNewAd(note: Ad) {
  //   this.noteList.unshift({ ...note })
  // }
  //
  // @action
  // private setUpdatingAd(note: Ad) {
  //   const updatedAdPosition = this.noteList.findIndex(
  //     item => item.id === note.id,
  //   )
  //   if (updatedAdPosition >= 0) {
  //     this.noteList[updatedAdPosition] = { ...note }
  //   }
  // }
  //
  // @action
  // private deleteAdFromList(note: Ad) {
  //   this.noteList.remove(note)
  // }
}

// tslint:disable-next-line:variable-name
export const AdCategoryStoreModel = mst(AdCategoryActions, AdCategoryStoreData, 'AdCategoryStore')

export type AdCategoryStore = Instance<typeof AdCategoryStoreModel>
