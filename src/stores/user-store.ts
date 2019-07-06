import { action, mst, shim } from 'classy-mst'
import { getEnv, Instance, types } from 'mobx-state-tree'
// import { loadString, saveString } from '../../components/storage'
import { formError } from '../../components/utils/error-utils'
import promiseTimer from '../../components/utils/promise-timer'
import { Environment } from '../app/environment'
import { User } from '../services/api/user'
import { T } from '../style/values'

// tslint:disable-next-line:variable-name
const UserStoreData = types.model({
  isLogging: false,
  user: types.frozen<User>(),
  loginError: types.frozen(),
})

// tslint:disable-next-line:variable-name
const DemoUser = {
  id: 11,
  fullName: 'Title',
  avatarUrl: 'Description',
} as User

class UserActions extends shim(UserStoreData) {
  // @ts-ignore
  private get env() {
    return getEnv(this) as Environment
  }

  @action
  public login(email, password): Promise<void> {
    this.isLogging = true
    return promiseTimer(2000)
      .then(data => {
        this.setIsLogging(false)
        this.setUser(DemoUser)
        return Promise.resolve()
      })
      .catch(error => {
        this.setIsLogging(false)
        console.tron.log(`User error: ${JSON.stringify(error)}`)
        return Promise.reject(formError(error, T.string.get_note_list_error))
      })
  }

  @action
  public setIsLogging(isLogging: boolean) {
    this.isLogging = isLogging
  }

  @action
  public setUser(user: User) {
    this.user = user
  }

  // @action
  // private setNewNote(note: Note) {
  //   this.noteList.unshift({ ...note })
  // }
  //
  // @action
  // private setUpdatingNote(note: Note) {
  //   const updatedNotePosition = this.noteList.findIndex(
  //     item => item.id === note.id,
  //   )
  //   if (updatedNotePosition >= 0) {
  //     this.noteList[updatedNotePosition] = { ...note }
  //   }
  // }
  //
  // @action
  // private deleteNoteFromList(note: Note) {
  //   this.noteList.remove(note)
  // }
}

// tslint:disable-next-line:variable-name
export const UserStoreModel = mst(UserActions, UserStoreData, 'UserStore')

export type UserStore = Instance<typeof UserStoreModel>
