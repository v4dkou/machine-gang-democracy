import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { View, SectionList, StyleSheet } from 'react-native'
import { FAB, Card, Title, Paragraph } from 'react-native-paper'
import ContentState from '../../components/content-state'
import {
  renderEmptyView,
  renderErrorView,
} from '../../components/design/flat-alert'
import { NavigationStore } from '../../components/navigation/navigation-store'
import { Advertisement, AdvertisementSubcategory } from '../services/api/api'
import { AdStore } from '../stores/ad-store'
import {
  emptyNavigationOptions,
  ScreenContainer,
} from '../style/navigation'
import { T } from '../style/values'
import { AdListViewModel } from '../view-models/ad-list'
import { buttonProps } from '../views/button'

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: T.spacing.default,
    backgroundColor: T.color.accent,
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
    paddingHorizontal: 0,
    elevation: 7,
    borderRadius: 10
  },
  itemTitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemContent: {
    paddingVertical: T.spacing.default,
    paddingHorizontal: T.spacing.default
  },
})

interface AdListProps {
  adStore?: AdStore
  navigationStore?: NavigationStore
}

@inject('adStore')
@inject('navigationStore')
@observer
export class AdListScreen extends Component<AdListProps> {
  public static navigationOptions = emptyNavigationOptions

  public static keyExtractor(item: Advertisement) {
    return item.id.toString()
  }

  public readonly viewModel = new AdListViewModel(this.props.adStore, this.props.navigation.getParam('subcategoryId'))

  public renderAdList = (adList: Advertisement[]) => (
    <SectionList
      sections={[{ data: adList }]}
      renderItem={this.renderItem}
      keyExtractor={AdListScreen.keyExtractor}
      contentContainerStyle={styles.contentContainerStyle}
      endFillColor={styles.contentContainerStyle.backgroundColor}
    />
  )

  public renderItem = ({ item }: { item: Advertisement }) => (
    <Card style={styles.item}>
      <Card.Cover source={{ uri: item.image }} />

      <Card.Content style={styles.itemContent}>
        <View style={styles.itemTitle}>
          <Title>{item.title}</Title>
          {(!!item.price) &&
            <Title>{item.price}</Title>
          }
        </View>
      </Card.Content>

      <Card.Content style={styles.itemContent}>
        <Paragraph>{item.description}</Paragraph>
      </Card.Content>
    </Card>
  )

  public render() {
    return (
      <ScreenContainer>
        <ContentState
          isFetching={this.viewModel.adListRequest.isFetching}
          error={this.viewModel.adListRequest.error}
          dataSource={
            this.props.adStore.adList
              ? this.props.adStore.adList.slice()
              : null
          }
          renderData={this.renderAdList}
          renderEmpty={renderEmptyView(
            T.string.note_list_empty,
            this.viewModel.loadAdList,
            null,
            null,
            buttonProps,
          )}
          renderError={renderErrorView(
            this.viewModel.loadAdList,
            null,
            null,
            buttonProps,
          )}
        />
        <FAB
          style={styles.fab}
          icon="add"
          color={'white'}
        />
      </ScreenContainer>
    )
  }
}

export function routeToAdList(navStore: NavigationStore, subcategory?: AdvertisementSubcategory) {
  navStore.navigateTo('AdList', subcategory ? { subcategoryId: subcategory.id } : null)
}
