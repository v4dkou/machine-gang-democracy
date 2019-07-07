import { observer } from 'mobx-react'
import {
  createMaterialTopTabNavigator,
  createStackNavigator,
} from 'react-navigation'

import { AdCategoryListScreen } from '../screens/ad-category-list'
import { AdListScreen } from '../screens/ad-list'
import { DiscussionListScreen } from '../screens/discussion-list'
import { NoteScreen } from '../screens/note'

export const MainNavigator = observer(
  createMaterialTopTabNavigator(
    {
      Discussion: {
        screen: createStackNavigator({
          DiscussionList: {
            screen: DiscussionListScreen,
          },
          Note: {
            screen: NoteScreen,
          },
        }),
        navigationOptions: { title: 'Актуальное' },
      },
      AdCategoryList: {
        screen: createStackNavigator({
          AdCategoryList: {
            screen: AdCategoryListScreen
          },
          AdList: {
            screen: AdListScreen
          }
          // Note: {
          //   screen: NoteScreen,
          // },
        }),
        navigationOptions: { title: 'Объявления рядом' },
      },
    },
    {
      tabBarOptions: {
        labelStyle: {
          fontSize: 16,
          fontFamily: 'IBMPlexSans-Bold',
          color: '#000'
        },
        style: {
          backgroundColor: '#FFF',
        },
        activeTintColor: '#828282',
        inactiveTintColor: '#333',
        indicatorStyle: {
          width: 0,
        },
        scrollEnabled: true,
      },
    },
  ),
)
