import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { getNavigationStoreModel } from '../../components/navigation/navigation-store'
import { DEFAULT_STATE, RootNavigator } from '../navigation/root-navigator'
import { AdStoreModel } from '../stores/ad-store'
import { AdCategoryStoreModel } from '../stores/ad-categories-store'
import { DiscussionStoreModel } from '../stores/discussion-store'
import {UserStoreModel} from '../stores/user-store';

/**
 * An RootStore model.
 */
// tslint:disable-next-line:variable-name
export const RootStoreModel = types.model('RootStore').props({
  navigationStore: getNavigationStoreModel(RootNavigator, DEFAULT_STATE),
  adStore: AdStoreModel,
  adCategoryStore: AdCategoryStoreModel,
  discussionStore: DiscussionStoreModel,
  userStore: UserStoreModel,
})

/**
 * The RootStore instance.
 */
export type RootStore = Instance<typeof RootStoreModel>

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = SnapshotOut<typeof RootStoreModel>
