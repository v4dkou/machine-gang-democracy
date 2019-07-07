import React, { ReactElement, Component } from 'react'
import { NavigationScreenOptions, SafeAreaView } from 'react-navigation'
import { T } from './values'
import {
  StatusBar,
  StatusBarProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

/**
 * Создаёт стиль для navbar'а, единый для приложения
 * @param {string} title Заголовок сцены
 * @param {string} icons Иконки в ActionBar'е
 * @return {{title: *, headerStyle: {backgroundColor: string}, headerTitleStyle: {color: string}, headerTintColor: string}}
 */
export function createBasicNavigationOptions(
  title: string,
  icons?: ReactElement<any>,
): NavigationScreenOptions {
  return {
    title,
    headerStyle: { backgroundColor: T.color.primary },
    headerTitleStyle: { color: 'black' },
    headerTintColor: 'black',
    headerRight: icons,
  }
}


/**
 * Создаёт стиль для navbar'а, единый для приложения
 * @param {string} title Заголовок сцены
 * @param {string} icons Иконки в ActionBar'е
 * @return {{title: *, headerStyle: {backgroundColor: string}, headerTitleStyle: {color: string}, headerTintColor: string}}
 */
export function createFlatNavigationOptions(
    title: string,
    icons?: ReactElement<any>,
): NavigationScreenOptions {
  return {
    title,
    headerStyle: { backgroundColor: T.color.transparent },
    headerTitleStyle: { color: 'black' },
    headerTintColor: 'black',
    headerRight: icons,
  }
}

/**
 * Пустой navbar для экрана
 * @param {string} title Заголовок сцены
 * @param {string} icons Иконки в ActionBar'е
 * @return {{title: *, headerStyle: {backgroundColor: string}, headerTitleStyle: {color: string}, headerTintColor: string}}
 */
export const emptyNavigationOptions: NavigationScreenOptions = {
  header: null,
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: T.color.yellowBackground,
  },
})

interface ScreenContainerProps extends StatusBarProps {
  style?: StyleProp<ViewStyle>
}

export class ScreenContainer extends Component<ScreenContainerProps> {
  // Uncomment if use tabs with different styles
  // TODO: https://reactnavigation.org/docs/en/status-bar.html
  // private _navListener: NavigationEventSubscription
  //
  // componentDidMount() {
  //     this._navListener = this.props.navigation.addListener('didFocus', () => {
  //         const color = this.props.backgroundColor || T.color.primary
  //         const barStyle = this.props.barStyle || 'light-content'
  //
  //         StatusBar.setBarStyle(barStyle);
  //         isAndroid && StatusBar.setBackgroundColor(color);
  //     });
  // }
  //
  // componentWillUnmount() {
  //     this._navListener.remove();
  // }

  render() {
    return (
      <SafeAreaView style={styles.flex}>
        <StatusBar
          backgroundColor={this.props.backgroundColor || '#FFF'}
          barStyle={this.props.barStyle || 'dark-content'}
        />
        <View style={[this.props.style, styles.centerContent]}>
          {this.props.children}
        </View>
      </SafeAreaView>
    )
  }
}
