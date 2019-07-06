import { observer } from 'mobx-react'
import {
  createMaterialTopTabNavigator,
  createStackNavigator,
} from 'react-navigation'
import { NoteScreen } from '../screens/note'
import { DiscussionListScreen } from '../screens/discussion-list'
import { AdListScreen } from '../screens/ad-list'

export const MainNavigator = observer(
  createMaterialTopTabNavigator({
    Discussion: createStackNavigator({
      DiscussionList: {
        screen: DiscussionListScreen,
      },
      Note: {
        screen: NoteScreen,
      },
    }),
    Ads: createStackNavigator({
      AdList: {
        screen: AdListScreen,
      },
      Note: {
        screen: NoteScreen,
      },
    }),
  }),
)
