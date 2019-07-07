import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { SectionList, StyleSheet } from 'react-native'
import { FAB, Title, Paragraph, Card } from 'react-native-paper'
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
import { routeToDiscussion } from './discussion'

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
    backgroundColor: '#F8EEE4'
  },
  item: {
    marginTop: 15,
    paddingVertical: 0,
    elevation: 7,
    borderRadius: 10
  },
  itemAlert: {
    backgroundColor: '#F27B3B'
  },
  itemContent: {
    paddingVertical: T.spacing.default,
    paddingHorizontal: T.spacing.default
  },
  itemTitle: {
    margin: 0,
    lineHeight: 16,
    color: T.color.black,
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase'
  },
  itemText: {
    padding: 0,
    fontSize: 16
  },
  itemTextAlert: {
    color: T.color.white
  }
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

  public loadNextPage = () => {
    this.viewModel.loadNextPage()
  }

  public renderDiscussionList = (discussionList: DiscussionTopic[]) => (
    <SectionList
      contentContainerStyle={styles.contentContainerStyle}
      sections={[{ data: discussionList }]}
      renderItem={this.renderItem}
      endFillColor={styles.contentContainerStyle.backgroundColor}
      keyExtractor={DiscussionListScreen.keyExtractor}
      onEndReached={this.loadNextPage}
    />
  )

  public renderItem = ({ item }: { item: DiscussionTopic }) => (
    <Card style={[styles.item, item.alert && styles.itemAlert]} onPress={this.routeToDiscussion(item)}>
      <Card.Content style={styles.itemContent}>
        {(item.initiative && item.status === 'voting') &&
          <Title style={[styles.itemTitle, item.alert && styles.itemTextAlert]}>Голосование</Title>
        }
        {(item.initiative && item.status === 'new') &&
          <Title style={[styles.itemTitle, item.alert && styles.itemTextAlert]}>Обсуждение</Title>
        }
        <Paragraph style={[styles.itemText, item.alert && styles.itemTextAlert]}>{item.description} ({item.user.username})</Paragraph>
      </Card.Content>
    </Card>
  )

  public routeToDiscussion = (discussion: DiscussionTopic) => () => {
    routeToDiscussion(this.props.navigationStore, discussion)
  }

  public routeToCreateDiscussion = () => {
    routeToDiscussion(this.props.navigationStore)
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
          color={T.color.accent}
          onPress={this.routeToCreateDiscussion}
        />
      </ScreenContainer>
    )
  }
}
