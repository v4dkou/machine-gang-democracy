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
import { Ad } from '../services/api/ad'
import { AdStore } from '../stores/ad-store'
import {
  emptyNavigationOptions,
  ScreenContainer,
} from '../style/navigation'
import { T } from '../style/values'
import { AdListViewModel } from '../view-models/ad-list'
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

interface AdListProps {
  adStore?: AdStore
  navigationStore?: NavigationStore
}

@inject('adStore')
@inject('navigationStore')
@observer
export class AdListScreen extends Component<AdListProps> {
  public static navigationOptions = emptyNavigationOptions

  public static keyExtractor(item: Ad) {
    return item.id.toString()
  }

  public readonly viewModel = new AdListViewModel(this.props.adStore)

  public renderAdList = (noteList: Ad[]) => (
    <SectionList
      sections={[{ data: noteList }]}
      renderItem={this.renderItem}
      keyExtractor={AdListScreen.keyExtractor}
    />
  )

  public renderItem = ({ item }: { item: Ad }) => (
    <TouchableRipple style={styles.item} onPress={this.routeToNote(item)}>
      <Text>{item.title}</Text>
    </TouchableRipple>
  )

  public routeToNote = (note: Ad) => () => {
    routeToNote(this.props.navigationStore, note)
  }

  public routeToCreateAd = () => {
    routeToNote(this.props.navigationStore)
  }

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
          onPress={this.routeToCreateAd}
        />
      </ScreenContainer>
    )
  }
}
