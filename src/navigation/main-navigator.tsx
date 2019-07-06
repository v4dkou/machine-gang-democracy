import { observer } from 'mobx-react'
import { createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation'
import { NoteScreen } from '../screens/note'
import { NoteListScreen } from '../screens/note-list'

export const MainNavigator = observer(
    createMaterialTopTabNavigator({
      Discussion: createStackNavigator({
        NoteList: {
          screen: NoteListScreen,
        },
        Note: {
          screen: NoteScreen,
        },
      }),
    }),
)
