import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { StyleSheet, View } from 'react-native'
import { NavigationStore } from '../../components/navigation/navigation-store'
import { ChatStore } from '../stores/chat-store'
import { emptyNavigationOptions, ScreenContainer } from '../style/navigation'
import { T } from '../style/values'
import {
  GiftedChat,
  Send,
} from 'react-native-gifted-chat'
import { Chat } from '../services/api'
import { ChatViewModel } from '../view-models/chat'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DiscussionMessage from '../views/chat/message'

const styles = StyleSheet.create({
  iconContainer: {
    padding: 8,
  },
  listView: {
    backgroundColor: T.color.yellowBackground,
  },
  textInput: {
    elevation: 8,
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

  public readonly viewModel = new ChatViewModel(this.props.chatStore, 1)

  private renderSend(props) {
    return (
      <Send alwaysShowSend={true} {...props}>
        <View style={styles.iconContainer}>
          <Icon name="send" color={T.color.accent} size={24} />
        </View>
      </Send>
    )
  }

  private renderMessage(props) {
    return <DiscussionMessage {...props} />
  }

  private renderDay(props) {
    return <View />
  }

  public render() {
    return (
      <ScreenContainer>
        <GiftedChat
          messages={this.viewModel.chatRequest.data}
          onSend={this.viewModel.sendMessages}
          renderSend={this.renderSend}
          renderMessage={this.renderMessage}
          // renderBubble={this.renderBubble}
          placeholder={'Ваш ответ'}
          user={{
            _id: 1,
          }}
          alignTop={true}
          listViewProps={{ style: styles.listView }}
          renderDay={this.renderDay}
          onLoadEarlier={this.viewModel.loadNextPage}
        />
      </ScreenContainer>
    )
  }
}
