import { autorun, IReactionDisposer } from 'mobx'
import { disposeOnUnmount, Provider } from 'mobx-react'
import { contains } from 'ramda'
import React, { Component } from 'react'
import GlobalFont from 'react-native-global-font'
import { StatefulNavigator } from '../../components/navigation'
import { BackButtonHandler } from '../../components/navigation/back-button-handler'
import { ConnectionError } from '../../components/utils/error-utils'
import { showLongToast } from '../../components/utils/toast-utils'
import { DEFAULT_NAVIGATION_CONFIG } from '../navigation/navigation-config'
import { T } from '../style/values'
import { RootStore } from './root-store'
import { setupRootStore } from './setup-root-store'

interface RootComponentState {
  rootStore?: RootStore
}

interface Props {}
export default class App extends Component<Props, RootComponentState> {
  public static canExit(routeName: string) {
    return contains(routeName, DEFAULT_NAVIGATION_CONFIG.exitRoutes)
  }
  @disposeOnUnmount
  private unauthorizedDisposer: IReactionDisposer
  public async componentDidMount() {
    GlobalFont.applyGlobal('IBMPlexSans-Light')
    this.setState(
      {
        rootStore: await setupRootStore(),
      },
      () => {
        const nextSetup = () => {
          const {
            userStore,
            // messagesStore,
            navigationStore,
          } = this.state.rootStore

          // messagesStore.setupMessages(); TODO: Initialize data preload here

          const isUnauthorized = (err: ConnectionError) =>
            err && err.unauthorized
          this.unauthorizedDisposer = autorun(() => {
            const hadUnauthorized = isUnauthorized(userStore.loginError)
            // || isUnauthorized(messagesStore.error) TODO: Check other 401s

            if (userStore.isLogged && hadUnauthorized) {
              console.tron.warn('Triggered 401')
              showLongToast(T.string.token_expired)
              userStore.clearUser()
              navigationStore.navigateTo('Login') // TODO: Return user after authorization
            }
          })
        }

        this.state.rootStore.userStore
          .setupUser()
          .then(nextSetup)
          .catch(nextSetup)
      },
    )
  }

  public render() {
    const rootStore = this.state && this.state.rootStore

    // Before we show the app, we have to wait for our state to be ready.
    // In the meantime, don't render anything. This will be the background
    // color set in native by rootView's background color.
    //
    // This step should be completely covered over by the splash screen though.
    //
    // You're welcome to swap in your own component to render if your boot up
    // sequence is too slow though.
    if (!rootStore) {
      return null
    }

    // otherwise, we're ready to render the app

    return (
      <Provider rootStore={rootStore} {...rootStore}>
        <BackButtonHandler canExit={App.canExit}>
          <StatefulNavigator />
        </BackButtonHandler>
      </Provider>
    )
  }
}
