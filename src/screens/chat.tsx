import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { StyleSheet } from 'react-native'
import { NavigationStore } from '../../components/navigation/navigation-store'
import { ChatStore } from '../stores/chat-store'
import { emptyNavigationOptions, ScreenContainer } from '../style/navigation'
import { T } from '../style/values'
import { GiftedChat } from 'react-native-gifted-chat'
import { Chat } from '../services/api'
import { ChatViewModel } from '../view-models/chat'

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: T.spacing.default,
    backgroundColor: T.color.white,
    right: 0,
    bottom: 0,
  },
  contentContainerStyle: {
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 20,
    backgroundColor: '#F8EEE4',
  },
  item: {
    marginTop: 15,
    paddingVertical: 0,
    elevation: 7,
    borderRadius: 10,
  },
  itemAlert: {
    backgroundColor: '#F27B3B',
  },
  itemContent: {
    paddingVertical: T.spacing.default,
    paddingHorizontal: T.spacing.default,
  },
  itemTitle: {
    margin: 0,
    lineHeight: 16,
    color: T.color.black,
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  itemText: {
    padding: 0,
    fontSize: 16,
  },
  itemTextAlert: {
    color: T.color.white,
  },
})

interface DiscussionListProps {
  chatStore?: ChatStore
  navigationStore?: NavigationStore
}

@inject('chatStore')
@inject('navigationStore')
@observer
export class ChatScreen extends Component<DiscussionListProps> {
  public static navigationOptions = emptyNavigationOptions

  public static keyExtractor(item: Chat) {
    return item.id.toString()
  }

  public readonly viewModel = new ChatViewModel(this.props.chatStore)

  public render() {
    return (
      <ScreenContainer>
        <GiftedChat
          messages={this.viewModel.chatRequest.data}
          onSend={this.viewModel.sendMessages}
          user={{
            _id: 1,
          }}
         alignTop={false}/>
      </ScreenContainer>
    )
  }
}