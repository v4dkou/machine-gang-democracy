import { observer } from 'mobx-react'
import {
  createMaterialTopTabNavigator,
  createStackNavigator,
} from 'react-navigation'

import { AdCategoryListScreen } from '../screens/ad-category-list'
import { AdListScreen } from '../screens/ad-list'
import { ChatScreen } from '../screens/chat'
import { DiscussionListScreen } from '../screens/discussion-list'
import { CreateDiscussionScreen } from '../screens/discussion-create'
import { T } from '../style/values'

const tabOptions = {
  tabBarOptions: {
    labelStyle: {
      fontSize: 20,
      fontFamily: 'IBMPlexSans-Bold',
      color: '#000',
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
    cardStyle: {
      backgroundColor: T.color.yellowBackground,
    },
  },
}

export const MainNavigator = observer(
  createStackNavigator(
    {
      Main: {
        screen: createMaterialTopTabNavigator(
          {
            DiscussionList: {
              screen: DiscussionListScreen,
              navigationOptions: { title: 'Актуальное' },
            },
            AdCategoryList: {
              screen: AdCategoryListScreen,
              navigationOptions: { title: 'Объявления рядом' },
            },
          },
          tabOptions,
        ),
        navigationOptions: { header: null },
      },
      DiscussionDetails: {
        screen: createMaterialTopTabNavigator(
          {
            Chat: ChatScreen,
            Vote: AdListScreen,
            Process: AdListScreen,
          },
          tabOptions,
        ),
      },
      AdList: {
        screen: AdListScreen,
      },
      CreateDiscussion: {
        screen: CreateDiscussionScreen
      }
    },
    {
      cardStyle: {
        backgroundColor: T.color.yellowBackground,
      },
      containerOptions: {
        backgroundColor: T.color.yellowBackground,
      },
    },
  ),
)
