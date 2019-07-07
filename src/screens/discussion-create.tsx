import { action, observable, reaction } from 'mobx'
import { disposeOnUnmount, inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { ActivityIndicator, StyleSheet, Text } from 'react-native'
import { HelperText, IconButton, TextInput } from 'react-native-paper'
import { NavigationScreenProps } from 'react-navigation'
import { NavigationStore } from '../../components/navigation/navigation-store'
import { showLongToastOnError } from '../../components/utils/error-utils'
import { showLongToast } from '../../components/utils/toast-utils'
import { DiscussionTopic } from '../services/api/api'
import { DiscussionStore } from '../stores/discussion-store'
import {
  createBasicNavigationOptions,
  ScreenContainer,
} from '../style/navigation'
import { T } from '../style/values'
import { DiscussionViewModel } from '../view-models/discussion'
import CommonButton from '../views/button'

const IS_SHOW_ICON_KEY = 'isShowIcon'
const TITLE_KEY = 'title'
const IS_EDIT_KEY = 'isEdit'
const SWITCH_EDIT_KEY = 'switchEdit'

const styles = StyleSheet.create({
  container: {
    padding: T.spacing.default,
  },
  description: {
    flex: 1,
    textAlign: 'left',
  },
})

interface CreateDiscussionScreenProps extends NavigationScreenProps {
  discussionStore?: DiscussionStore
  navigationStore?: NavigationStore
}

@inject('discussionStore')
@inject('navigationStore')
@observer
export class CreateDiscussionScreen extends Component<CreateDiscussionScreenProps> {
  public static navigationOptions = ({ navigation }) =>
    createBasicNavigationOptions(
      navigation.getParam(TITLE_KEY) || 'Создание обсуждения',
      navigation.getParam(IS_SHOW_ICON_KEY, false) ? (
        <IconButton
          color={'black'}
          icon={navigation.getParam(IS_EDIT_KEY, false) ? 'check' : 'edit'}
          onPress={navigation.getParam(SWITCH_EDIT_KEY)}
        />
      ) : null,
    )

  public readonly viewModel = new DiscussionViewModel(
    this.props.discussionStore,
    this.props.navigation.getParam('discussionId'),
  )

  @disposeOnUnmount
  public discussionDisposer = reaction(
    () => this.viewModel.discussion,
    discussion => {
      this.props.navigation.setParams({
        [TITLE_KEY]: discussion ? discussion.id.toString() : undefined,
        [IS_SHOW_ICON_KEY]: !!discussion,
      })
      this.viewModel.updateDiscussionData()
    },
  )

  @disposeOnUnmount
  public isEditDisposer = reaction(
    () => this.isEdit,
    isEdit => {
      this.props.navigation.setParams({ [IS_EDIT_KEY]: isEdit })
    },
  )

  @disposeOnUnmount
  public saveNoteErrorDisposer = showLongToastOnError(
    () => this.viewModel.saveDiscussionRequest.error,
  )

  @disposeOnUnmount
  public saveNoteSuccessDisposer = reaction(
    () => this.viewModel.saveDiscussionRequest.data,
    data => {
      if (data) {
        showLongToast(
          this.viewModel.discussionId
            ? T.string.update_note_success
            : T.string.write_note_success,
        )
        this.setEdit(false)
        this.viewModel.updateDiscussionId(data.id)
      }
    },
  )

  // @disposeOnUnmount
  // public deleteNoteErrorDisposer = showLongToastOnError(
  //   () => this.viewModel.deleteNoteRequest.error,
  // )

  // @disposeOnUnmount
  // public deleteNoteSuccessDisposer = reaction(
  //   () =>
  //     !this.viewModel.deleteNoteRequest.isFetching &&
  //     !this.viewModel.deleteNoteRequest.error,
  //   isSuccess => {
  //     if (isSuccess) {
  //       showLongToast(T.string.delete_note_success)
  //       this.props.navigationStore.navigateBack()
  //     }
  //   },
  // )

  @observable
  public isEdit: boolean

  public componentDidMount(): void {
    const discussion = this.viewModel.discussion

    this.setEdit(!discussion)

    this.props.navigation.setParams({
      [TITLE_KEY]: discussion ? discussion.id.toString() : undefined,
      [SWITCH_EDIT_KEY]: this.switchEdit,
      [IS_SHOW_ICON_KEY]: !!discussion,
    })
  }

  @action
  public switchEdit = () => {
    this.isEdit = !this.isEdit
  }

  @action
  public setEdit(isEdit: boolean) {
    this.isEdit = isEdit
  }

  public *renderShowDiscussion() {
    yield (
      <Text style={styles.description}>
        {`Описание: ${this.viewModel.discussion.description}`}
      </Text>
    )
  }

  public *renderEditDiscussion() {
    yield (
      <TextInput
        style={styles.description}
        label="Описание"
        value={this.viewModel.description.data}
        multiline={true}
        onChangeText={this.viewModel.setDescription}
      />
    )
    yield (
      <HelperText type="error" visible={!this.viewModel.description.isValid}>
        {this.viewModel.description.error}
      </HelperText>
    )

    if (this.viewModel.saveDiscussionRequest.isFetching) {
      yield <ActivityIndicator size="large" />
    } else {
      yield (
        <CommonButton onPress={this.viewModel.savePressed}>
          Сохранить
        </CommonButton>
      )
    }
  }

  public *renderDiscussion() {
    if (this.viewModel.discussion && !this.isEdit) {
      yield [...this.renderShowDiscussion()]
    } else {
      yield [...this.renderEditDiscussion()]
    }
  }

  public render(): React.ReactNode {
    return (
      <ScreenContainer style={styles.container}>
        {[...this.renderDiscussion()]}
      </ScreenContainer>
    )
  }
}

export function routeToCreateDiscussion(navStore: NavigationStore, discussion?: DiscussionTopic) {
  navStore.navigateTo('CreateDiscussion', discussion ? { discussionId: discussion.id } : null)
}
