import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { SectionList, StyleSheet } from 'react-native'
import { FAB, Title, Paragraph, Card, TouchableRipple } from 'react-native-paper'
import ContentState from '../../components/content-state'
import {
  renderEmptyView,
  renderErrorView,
} from '../../components/design/flat-alert'
import { NavigationStore } from '../../components/navigation/navigation-store'
import { AdvertisementCategory, AdvertisementSubcategory } from '../services/api'
import { AdCategoryStore } from '../stores/ad-categories-store'
import {
  emptyNavigationOptions,
  ScreenContainer,
} from '../style/navigation'
import { T } from '../style/values'
import { AdCategoryListViewModel } from '../view-models/ad-category-list'
import { buttonProps } from '../views/button'
import { routeToAdList } from './ad-list'

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
  subcategory: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#BDBDBD'
  },
  itemAlert: {
    backgroundColor: '#F27B3B',
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
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

interface AdCategoryListProps {
  adCategoryStore?: AdCategoryStore
  navigationStore?: NavigationStore
}

@inject('adCategoryStore')
@inject('navigationStore')
@observer
export class AdCategoryListScreen extends Component<AdCategoryListProps> {
  public static navigationOptions = emptyNavigationOptions

  public static keyExtractor(item: AdvertisementCategory) {
    return item.id.toString()
  }

  public readonly viewModel = new AdCategoryListViewModel(this.props.adCategoryStore)

  public renderAdvertisementCategoryList = (adCategoryList: AdvertisementCategory[]) => {
    return (
    <SectionList
      contentContainerStyle={styles.contentContainerStyle}
      sections={[{ data: adCategoryList }]}
      renderItem={this.renderItem}
      endFillColor={styles.contentContainerStyle.backgroundColor}
      keyExtractor={AdCategoryListScreen.keyExtractor}
    />
  )}

  public renderItem = ({ item }: { item: AdvertisementCategory }) => (
    <Card style={[styles.item]}>
      <Card.Content style={styles.itemContent}>
        <Title style={[styles.itemTitle]}>{item.name}</Title>
      </Card.Content>

      {(item.subcategories.map((subcategory: AdvertisementSubcategory) => (
        <Card.Content key={subcategory.id}>
          <TouchableRipple onPress={() => this.routeToAdList(subcategory)}>
            <Paragraph style={[styles.subcategory]}>{subcategory.name}</Paragraph>
          </TouchableRipple>
        </Card.Content>
      )))}

      {(!!item.promo) &&
        <Card.Content style={[styles.subcategory, styles.itemAlert]}>
          <Paragraph style={[styles.itemTitle]}>{item.promo.title}</Paragraph>
        </Card.Content>
      }
    </Card>
  )

  public routeToAdList = (subcategory: AdvertisementSubcategory) => {
    console.tron.log(JSON.stringify(subcategory))
    routeToAdList(this.props.navigationStore, subcategory)
  }

  public render() {
    return (
      <ScreenContainer>
        <ContentState
          isFetching={this.viewModel.adCategoryListRequest.isFetching}
          error={this.viewModel.adCategoryListRequest.error}
          dataSource={
            this.props.adCategoryStore.adCategoryList
              ? this.props.adCategoryStore.adCategoryList.slice()
              : null
          }
          renderData={this.renderAdvertisementCategoryList}
          renderEmpty={renderEmptyView(
            T.string.note_list_empty,
            this.viewModel.loadAdCategoryList,
            null,
            null,
            buttonProps,
          )}
          renderError={renderErrorView(
            this.viewModel.loadAdCategoryList,
            null,
            null,
            buttonProps,
          )}
        />
        <FAB
          style={styles.fab}
          icon="add"
          color={T.color.accent}
        />
      </ScreenContainer>
    )
  }
}
