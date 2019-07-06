import { createStackNavigator, NavigationActions } from 'react-navigation'
import { MainNavigator } from './main-navigator'
import Login from '../screens/login'

export const RootNavigator = createStackNavigator(
  {
    Login: { screen: Login },
    Main: { screen: MainNavigator },
  },
  {
    headerMode: 'none',
    navigationOptions: { gesturesEnabled: false },
  },
)

export const DEFAULT_STATE = RootNavigator.router.getStateForAction(
  NavigationActions.init(),
  null,
)
