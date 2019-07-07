import { AppRegistry } from 'react-native'
import { name as AppName } from '../../app.json'
import App from './App'

console.disableYellowBox = true

AppRegistry.registerComponent(AppName, () => App)
