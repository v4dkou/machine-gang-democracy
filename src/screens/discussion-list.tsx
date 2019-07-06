import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { SectionList, StyleSheet, Text } from 'react-native'
import { FAB, TouchableRipple } from 'react-native-paper'
import ContentState from '../../components/content-state'
import {
  renderEmptyView,
  renderErrorView,
} from '../../components/design/flat-alert'
import { NavigationStore } from '../../components/navigation/navigation-store'
import { DiscussionTopic } from '../services/api'
import { DiscussionStore } from '../stores/discussion-store'
import {
  emptyNavigationOptions,
  ScreenContainer,
} from '../style/navigation'
import { T } from '../style/values'
import { DiscussionListViewModel } from '../view-models/discussion-list'
import { buttonProps } from '../views/button'
import { routeToNote } from './note'

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: T.spacing.default,
    backgroundColor: T.color.accent,
    right: 0,
    bottom: 0,
  },
  item: {
    paddingStart: T.spacing.default,
    paddingEnd: T.spacing.default,
    paddingTop: T.spacing.small,
    paddingBottom: T.spacing.small,
  },
})

interface DiscussionListProps {
  discussionStore?: DiscussionStore
  navigationStore?: NavigationStore
}

@inject('discussionStore')
@inject('navigationStore')
@observer
export class DiscussionListScreen extends Component<DiscussionListProps> {
  public static navigationOptions = emptyNavigationOptions

  public static keyExtractor(item: DiscussionTopic) {
    return item.id.toString()
  }

  public readonly viewModel = new DiscussionListViewModel(this.props.discussionStore)

  public renderDiscussionList = (noteList: DiscussionTopic[]) => (
    <SectionList
      sections={[{ data: noteList }]}
      renderItem={this.renderItem}
      keyExtractor={DiscussionListScreen.keyExtractor}
    />
  )

  public renderItem = ({ item }: { item: DiscussionTopic }) => (
    <TouchableRipple style={styles.item} onPress={this.routeToNote(item)}>
      <Text>{item.announcement}</Text>
    </TouchableRipple>
  )

  public routeToNote = (note: DiscussionTopic) => () => {
    routeToNote(this.props.navigationStore, note)
  }

  public routeToCreateDiscussion = () => {
    routeToNote(this.props.navigationStore)
  }

  public render() {
    return (
      <ScreenContainer>
        <ContentState
          isFetching={this.viewModel.discussionListRequest.isFetching}
          error={this.viewModel.discussionListRequest.error}
          dataSource={
            this.props.discussionStore.discussionList
              ? this.props.discussionStore.discussionList.slice()
              : null
          }
          renderData={this.renderDiscussionList}
          renderEmpty={renderEmptyView(
            T.string.note_list_empty,
            this.viewModel.loadDiscussionList,
            null,
            null,
            buttonProps,
          )}
          renderError={renderErrorView(
            this.viewModel.loadDiscussionList,
            null,
            null,
            buttonProps,
          )}
        />
        <FAB
          style={styles.fab}
          icon="add"
          color={'white'}
          onPress={this.routeToCreateDiscussion}
        />
      </ScreenContainer>
    )
  }
}
