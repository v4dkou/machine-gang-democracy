import PropTypes from 'prop-types'
import React from 'react'
import { StyleSheet, View, ViewPropTypes, ViewStyle } from 'react-native'

import {
  Avatar,
  Day,
  IMessage,
  LeftRightStyle,
  User,
  utils,
} from 'react-native-gifted-chat'
import Bubble from './bubble'
import SystemMessage from 'react-native-gifted-chat/lib/SystemMessage'

const { isSameUser, isSameDay } = utils

interface MessageProps<TMessage extends IMessage> {
  key: any
  showUserAvatar?: boolean
  position: 'left' | 'right'
  currentMessage?: TMessage
  nextMessage?: TMessage
  previousMessage?: TMessage
  user: User
  inverted?: boolean
  containerStyle?: LeftRightStyle<ViewStyle>
  renderBubble?(props: Bubble['props']): React.ReactNode
  renderSystemMessage?(props: SystemMessage['props']): React.ReactNode
  renderAvatar?(props: Avatar['props']): React.ReactNode
  shouldUpdateMessage?(
    props: MessageProps<IMessage>,
    nextProps: MessageProps<IMessage>,
  ): boolean
}

export default class DiscussionMessage extends React.Component<MessageProps> {
  public static defaultProps = {
    renderAvatar: undefined,
    renderBubble: null,
    renderDay: null,
    currentMessage: {},
    nextMessage: {},
    previousMessage: {},
    user: {},
    containerStyle: {},
  }

  public getInnerComponentProps() {
    const { containerStyle, ...props } = this.props
    return {
      ...props,
      position: 'left',
      isSameUser,
      isSameDay,
    }
  }

  public renderBubble() {
    const bubbleProps = this.getInnerComponentProps()
    if (this.props.renderBubble) {
      return this.props.renderBubble(bubbleProps)
    }
    return <Bubble {...bubbleProps} />
  }

  public renderAvatar() {
    let extraStyle
    if (
      isSameUser(this.props.currentMessage, this.props.previousMessage) &&
      isSameDay(this.props.currentMessage, this.props.previousMessage)
    ) {
      // Set the invisible avatar height to 0, but keep the width, padding, etc.
      extraStyle = { height: 0 }
    }

    const avatarProps = this.getInnerComponentProps()
    return (
      <Avatar
        {...avatarProps}
        imageStyle={{
          left: [styles.avatar, avatarProps.imageStyle, extraStyle],
        }}
      />
    )
  }

  public render() {
    const marginBottom = isSameUser(
      this.props.currentMessage,
      this.props.nextMessage,
    )
      ? 2
      : 10

    return (
      <View
        style={[styles.container, { marginBottom }, this.props.containerStyle]}
      >
        {this.renderAvatar()}
        {this.renderBubble()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
})
