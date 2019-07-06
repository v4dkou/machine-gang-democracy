import { RNFirebase } from 'react-native-firebase'
import { Reactotron } from '../services/reactotron'

import { Api } from '../services/api'

/**
 * The environment is a place where services and shared dependencies between
 * models live.  They are made available to every model via dependency injection.
 */
export class Environment {
  /**
   * Reactotron is only available in dev.
   */
  public reactotron: Reactotron

  public fcm: RNFirebase.messaging.Messaging

  public api: Api
}
