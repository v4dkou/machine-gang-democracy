import { action, mst, shim } from 'classy-mst'
import { getEnv, Instance, types } from 'mobx-state-tree'
// import { loadString, saveString } from '../../components/storage'
import { formError } from '../../components/utils/error-utils'
import promiseTimer from '../../components/utils/promise-timer'
import { Environment } from '../app/environment'
import { Ad } from '../services/api/ad'
import { T } from '../style/values'

// tslint:disable-next-line:variable-name
const AdStoreData = types.model({
  adList: types.array(types.frozen<Ad>()),
})

// tslint:disable-next-line:variable-name
const DemoAd = {
  id: 11,
  title: 'Title',
  description: 'Description',
} as Ad

class AdActions extends shim(AdStoreData) {
  // @ts-ignore
  private get env() {
    return getEnv(this) as Environment
  }

  public async fetchAdList() {
    try {
      await this.env.fcm.requestPermission()
      const token = await this.env.fcm.getToken()
      console.warn(JSON.stringify(token))
      await promiseTimer(2000)
      this.setAdList([DemoAd])
    } catch (error) {
      console.tron.log(`AdList error: ${JSON.stringify(error)}`)
      throw formError(error, T.string.get_note_list_error)
    }
  }

  @action
  public setAdList(noteList: Ad[]) {
    this.adList.clear()
    noteList.forEach(item => {
      this.adList.unshift({ ...item })
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
