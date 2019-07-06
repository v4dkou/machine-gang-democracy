import { action, mst, shim } from 'classy-mst'
import { getEnv, Instance, types } from 'mobx-state-tree'
// import { loadString, saveString } from '../../components/storage'
import { formError } from '../../components/utils/error-utils'
import { Environment } from '../app/environment'
import { User } from '../services/api'
import { T } from '../style/values'
import {
  load,
  loadString,
  remove,
  save,
  saveString,
} from '../../components/storage'

// tslint:disable-next-line:variable-name
const UserStoreData = types.model({
  isLogging: false,
  user: types.frozen<User>(),
  loginError: types.frozen(),
  accessToken: types.frozen<string>(),
})

const USER_PREF_KEY = 'pref_key: user'
export const ACCESS_TOKEN_PREF_KEY = 'pref_key: access_token'

class UserActions extends shim(UserStoreData) {
  // @ts-ignore
  private get env() {
    return getEnv(this) as Environment
  }

  @action
  public async login(email, password): Promise<void> {
    this.isLogging = true
    try {
      const data = await this.env.api.login.jwtLoginCreate({
        password,
        username: email,
      })
      console.tron.warn(`User info: ${JSON.stringify(data.data)}`)
      this.onLoginSuccess(data.data.user, data.data.token)
    } catch (error) {
      this.setIsLogging(false)
      console.tron.error(`User error: ${JSON.stringify(error)}`)
      throw formError(error, T.string.get_note_list_error)
    }
  }

  @action
  public setIsLogging(isLogging: boolean) {
    this.isLogging = isLogging
  }

  public async setupUser() {
    this.setAccessToken(await loadString(ACCESS_TOKEN_PREF_KEY))
    this.setUser(await load(USER_PREF_KEY))

    if (this.isLogged) {
      this.env.api.users
        .usersRead(this.user.id.toString())
        .then(data => {
          this.updateUser(data.data)
        })
        .catch(this.onSetupFail)
    }
  }

  @action
  private updateUser(user: User) {
    this.user = user
    this.saveUser(user)
  }

  @action
  public onLoginSuccess(user: User, accessToken: string) {
    this.isLogging = false
    this.user = user
    this.accessToken = accessToken
    // this.accessToken = accessToken
    this.saveUser(user)
    this.saveAccessToken(accessToken)
  }

  @action
  public onLoginError(error: any) {
    this.isLogging = false
    this.loginError = error
  }

  // TODO: 401 redirect
  private onSetupFail(err: any) {
    this.loginError = formError(err, T.string.get_user_error)
  }

  @action
  public setUser(user: User) {
    this.user = user
  }

  private async saveUser(user: User) {
    if (user) {
      await save(USER_PREF_KEY, user)
    } else {
      await remove(USER_PREF_KEY)
    }
  }

  private async saveAccessToken(token: string) {
    if (token) {
      await saveString(ACCESS_TOKEN_PREF_KEY, token)
    } else {
      await remove(ACCESS_TOKEN_PREF_KEY)
    }
  }

  @action
  public setAccessToken(accessToken: string) {
    this.accessToken = accessToken
  }

  get isLogged(): boolean {
    return this.accessToken != null && this.user != null
  }

  @action
  public clearUser() {
    this.user = null
    this.accessToken = null
    this.saveUser(null)
    this.saveAccessToken(null)
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
