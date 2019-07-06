import { onSnapshot } from 'mobx-state-tree'
import * as storage from '../../components/storage'
import { Reactotron } from '../services/reactotron'
import { Environment } from './environment'
import { RootStore, RootStoreModel } from './root-store'
import {
  AnnouncementsApi,
  Configuration,
  DiscussionTopicsApi,
  InitiativesApi,
  JwtLoginApi,
  MessagesApi, TOKEN_KEY,
  UserDevicesApi,
  UsersApi,
} from '../services/api'
import { BASE_PATH, DEFAULT_HEADERS } from '../services/api/base'
import { loadString } from '../../components/storage'
import { ACCESS_TOKEN_PREF_KEY } from '../stores/user-store'
// import firebase from 'react-native-firebase'

/**
 * The key we'll be saving our state as within async storage.
 */
const ROOT_STATE_STORAGE_KEY = 'root'

/**
 * Setup the root state.
 */
export async function setupRootStore() {
  let rootStore: RootStore
  let data: any

  // prepare the environment that will be associated with the RootStore.
  const oldToken = await loadString(ACCESS_TOKEN_PREF_KEY)
  const env = await createEnvironment(() => {
    return (
      (rootStore && rootStore.userStore.accessToken
        ? rootStore.userStore.accessToken.valueOf()
        : undefined) || oldToken
    )
  })
  try {
    // load data from storage
    data = (await storage.load(ROOT_STATE_STORAGE_KEY)) || {}
    rootStore = RootStoreModel.create(data, env)
  } catch (e) {
    // if there's any problems loading, then let's at least fallback to an empty state
    // instead of crashing.
    rootStore = RootStoreModel.create({} as any, env)

    // but please inform us what happened
    // tslint:disable-next-line:no-unused-expression
    __DEV__ && console.error(e.message, null)
  }

  // reactotron logging
  if (__DEV__) {
    env.reactotron.setRootStore(rootStore, data)
  }

  // Put here stores, which don't save onSnapshot
  const unsaveStores = {}

  // track changes & save to storage
  onSnapshot(rootStore, snapshot => {
    storage.save(ROOT_STATE_STORAGE_KEY, { ...snapshot, ...unsaveStores })
  })

  return rootStore
}

/**
 * Setup the environment that all the models will be sharing.
 *
 * The environment includes other functions that will be picked from some
 * of the models that get created later. This is how we loosly couple things
 * like events between models.
 */
export async function createEnvironment(getToken: () => string) {
  const env = new Environment()

  // create each service
  env.reactotron = new Reactotron()

  // TODO: JWT Expiration
  const apiConfig: Configuration = {
    basePath: BASE_PATH,
    get baseOptions() {
      const token = getToken()
      const headers = { ...DEFAULT_HEADERS }
      if (token) {
        headers[TOKEN_KEY] = `JWT ${token}`
      }
      return {
        headers,
      }
    },
  }

  env.api = {
    login: new JwtLoginApi(apiConfig),
    users: new UsersApi(apiConfig),
    discussions: new DiscussionTopicsApi(apiConfig),
    messages: new MessagesApi(apiConfig),
    announcements: new AnnouncementsApi(apiConfig),
    initiatives: new InitiativesApi(apiConfig),
    devices: new UserDevicesApi(apiConfig),
  }

  // env.fcm = firebase.messaging()

  // allow each service to setup
  await env.reactotron.setup()

  return env
}
