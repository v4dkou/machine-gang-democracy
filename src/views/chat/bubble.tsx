import React from 'react'
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

import {
  IMessage,
  LeftRightStyle,
  MessageImage,
  MessageText,
  RenderMessageImageProps,
  RenderMessageTextProps,
  RenderMessageVideoProps,
  Reply,
  User,
  utils,
} from 'react-native-gifted-chat'
import { T } from '../../style/values'

const { isSameUser, isSameDay } = utils

interface BubbleProps<TMessage extends IMessage> {
  user?: User
  touchableProps?: object
  renderUsernameOnMessage?: boolean
  position: 'left' | 'right'
  currentMessage?: TMessage
  nextMessage?: TMessage
  previousMessage?: TMessage
  optionTitles?: string
  containerStyle?: LeftRightStyle<ViewStyle>
  wrapperStyle?: LeftRightStyle<ViewStyle>
  textStyle?: LeftRightStyle<TextStyle>
  bottomContainerStyle?: LeftRightStyle<ViewStyle>
  tickStyle?: StyleProp<TextStyle>
  containerToNextStyle?: LeftRightStyle<ViewStyle>
  containerToPreviousStyle?: LeftRightStyle<ViewStyle>
  usernameStyle?: LeftRightStyle<ViewStyle>
  quickReplyStyle?: StyleProp<ViewStyle>
  onLongPress?(context?: any, message?: any): void
  onQuickReply?(replies: Reply[]): void
  renderMessageImage?(props: RenderMessageImageProps<TMessage>): React.ReactNode
  renderMessageVideo?(props: RenderMessageVideoProps<TMessage>): React.ReactNode
  renderMessageText?(props: RenderMessageTextProps<TMessage>): React.ReactNode
  renderCustomView?(bubbleProps: BubbleProps<TMessage>): React.ReactNode
  renderUsername?(): React.ReactNode
  isSameDay?(currentMessage: TMessage, nextMessage: TMessage): boolean
  isSameUser?(currentMessage: TMessage, nextMessage: TMessage): boolean
}

export default class DiscussionBubble<
  TMessage extends IMessage
> extends React.Component<BubbleProps<TMessage>> {
  static defaultProps = {
    touchableProps: {},
    onLongPress: null,
    renderMessageImage: null,
    renderMessageText: null,
    renderCustomView: null,
    renderTime: null,
    currentMessage: {
      text: null,
      createdAt: null,
      image: null,
    },
    nextMessage: {},
    previousMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    tickStyle: {},
    containerToNextStyle: {},
    containerToPreviousStyle: {},
  }

  public renderMessageText() {
    if (this.props.currentMessage.text) {
      const {
        containerStyle,
        wrapperStyle,
        messageTextStyle,
        ...messageTextProps
      } = this.props
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps)
      }
      return (
        <MessageText
          {...messageTextProps}
          textStyle={{
            left: [
              styles.messageText,
              messageTextProps.textStyle,
              messageTextStyle,
            ],
            right: [
              styles.messageText,
              messageTextProps.textStyle,
              messageTextStyle,
            ],
          }}
        />
      )
    }
    return null
  }

  public renderMessageImage() {
    if (this.props.currentMessage.image) {
      const { containerStyle, wrapperStyle, ...messageImageProps } = this.props
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps)
      }
      return (
        <MessageImage
          {...messageImageProps}
          imageStyle={[styles.slackImage, messageImageProps.imageStyle]}
        />
      )
    }
    return null
  }
  //
  // public renderUsername() {
  //   const username = this.props.currentMessage.user.name
  //   if (username) {
  //     const { containerStyle, wrapperStyle, ...usernameProps } = this.props
  //     if (this.props.renderUsername) {
  //       return this.props.renderUsername(usernameProps)
  //     }
  //     return (
  //       <Text
  //         style={[
  //           styles.standardFont,
  //           styles.headerItem,
  //           styles.username,
  //           this.props.usernameStyle,
  //         ]}
  //       >
  //         {username}
  //       </Text>
  //     )
  //   }
  //   return null
  // }

  public renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props)
    }
    return null
  }

  public render() {
    const isSameThread =
      isSameUser(this.props.currentMessage, this.props.previousMessage) &&
      isSameDay(this.props.currentMessage, this.props.previousMessage)

    // const messageHeader = isSameThread ? null : (
    //   <View style={styles.headerView}>{this.renderUsername()}</View>
    // )

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity
          accessibilityTraits="text"
          {...this.props.touchableProps}
        >
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <View>
              {this.renderCustomView()}
              {/*{messageHeader}*/}
              {this.renderMessageImage()}
              {this.renderMessageText()}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  messageText: {
    fontSize: 16,
    color: T.color.black,
    marginLeft: 0,
    marginRight: 0,
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    borderRadius: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    backgroundColor: '#F2F2F2',
    padding: 14,
  },
  wrapper: {
    marginRight: 60,
    minHeight: 20,
    justifyContent: 'flex-end',
  },
  username: {
    fontWeight: 'bold',
  },
  time: {
    textAlign: 'left',
    fontSize: 12,
  },
  timeContainer: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  headerItem: {
    marginRight: 10,
  },
  headerView: {
    // Try to align it better with the avatar on Android.
    marginTop: Platform.OS === 'android' ? -2 : 0,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  slackImage: {
    borderRadius: 3,
    marginLeft: 0,
    marginRight: 0,
  },
})
