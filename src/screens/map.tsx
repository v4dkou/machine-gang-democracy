import React, { Component } from 'react'
import { WebView } from 'react-native'
import { NavigationState } from '../../components/navigation/navigation-state'
import { NavigationStore } from '../../components/navigation/navigation-store'
import { ScreenContainer } from '../style/navigation'

export class MapScreen extends Component {
  public render(): React.ReactNode {
    return (
      <ScreenContainer>
        <WebView
          source={{
              uri: 'https://codepen.io/Feodor_Evdokimov/full/YoOoPv',
          }}
          injectedJavaScript={'document.getElementById(\'main-header\').style = \'display: none;\''}
          startInLoadingState={true}
        />
      </ScreenContainer>
    )
  }
}

export function routeToMap(
  navigationStore: NavigationStore,
  url: string,
  navigationState = NavigationState.LAST,
) {
  navigationStore.navigateTo('Map', {}, navigationState)
}
