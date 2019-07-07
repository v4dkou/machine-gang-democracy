import { action, mst, shim } from 'classy-mst'
import { getEnv, Instance, types } from 'mobx-state-tree'
// import { loadString, saveString } from '../../components/storage'
import { formError } from '../../components/utils/error-utils'
import { Environment } from '../app/environment'
import { Advertisement } from '../services/api/api'
import { T } from '../style/values'

// tslint:disable-next-line:variable-name
const AdStoreData = types.model({
  adList: types.array(types.frozen<Advertisement>()),
  subcategory: types.optional(types.string, ''),
  nextPageToken: types.optional(types.string, '')
})

class AdActions extends shim(AdStoreData) {
  // @ts-ignore
  private get env() {
    return getEnv(this) as Environment
  }

  public async fetchAdList(subcategory?: string) {
    try {
      const options = { query: { subcategory } } as any
      const data = await this.env.api.advertisements.advertisementsList(null, null, options)

      if (data.data.next) {
        this.setNextPageToken(data.data.next)
      }
      this.setAdList(data.data.results)
    } catch (error) {
      console.tron.log(`AdList error: ${JSON.stringify(error)}`)
      throw formError(error, T.string.get_note_list_error)
    }
  }

  @action
  public setAdList(adList: Advertisement[]) {
    this.adList.clear()
    adList.forEach(item => {
      this.adList.unshift({ ...item })
    })
  }

  @action
  public setNextPageToken(nextPageToken?: string) {
    this.nextPageToken = nextPageToken
  }

  @action
  public updateAdvertisementList(adList: Advertisement[]) {
    adList.forEach(item => {
      this.adList.push({ ...item })
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
export const AdStoreModel = mst(AdActions, AdStoreData, 'AdStore')

export type AdStore = Instance<typeof AdStoreModel>
