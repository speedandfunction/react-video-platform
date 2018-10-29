import {
  settingsWatcher as SettingsSaga,
  staticPagesWatcher as StaticSaga,
  getCategoriesWatcher as CategoriesSaga,
  getIntrosWatcher as IntrosSaga,
  getMagiciansWatcher as GetMagiciansSaga,
} from './settings';

import {
  loginWatcher as LoginSaga,
  registerWatcher as RegisterSaga,
  couponWatcher as CouponSaga,
  subscribeWatcher as SubscribeSaga,
  getCouponWatcher as GetCouponSaga,
  resetPasswordWatcher as ResetPasswordSaga,
  unsubscribeWatcher as UnsubscribeSaga,
} from './auth';

import {
  getTutorialsIntroWatcher as GetIntroVideoSaga,
  getCardVideoWatcher as GetCardVideoSaga,
  getMagicianTutorialsWatcher as MagicianTutorialsSaga,
  getMagicianCategoriesVideosWatcher as GetMagicianCategoriesVideosSaga,
  getVideoReviewsWatcher as GetVideoReviewsSaga,
  createVideoReviewWatcher as CreateVideoReviewSaga,
  getPageVideoWatcher as GetPageVideoSaga,
} from './media';

import {
  searchVideosWatcher as SearchVideosSaga,
} from './search';

import {
  addToWishListWatcher as AddToWishListSaga,
  removeFromWishListWatcher as RemoveFromWishListSaga,
  trackVideoWatcher as trackVideoSaga,
  getActiveProfileWatcher as getActiveProfileSaga,
  likeVideoWatcher as likeVideoSaga,
  disLikeVideoWatcher as disLikeVideoSaga,
  updateProfileWatcher as UpdateProfileSaga,
  getSubProfileWatcher as GetSubProfileSaga,
  deleteProfileWatcher as DeleteProfileSaga,
  accountUpdateWatcher as AccountUpdateSaga,
  passwordUpdateWatcher as PasswordUpdateSaga,
  deleteAccountWatcher as DeleteAccountSaga,
} from './user';

export default function* IndexSaga() {
  yield [
    SettingsSaga(),
    StaticSaga(),
    CategoriesSaga(),
    IntrosSaga(),
    GetMagiciansSaga(),
    GetCouponSaga(),
    ResetPasswordSaga(),

    LoginSaga(),
    RegisterSaga(),
    CouponSaga(),
    SubscribeSaga(),
    UnsubscribeSaga(),

    SearchVideosSaga(),

    /* Media watchers */
    GetIntroVideoSaga(),
    GetCardVideoSaga(),
    MagicianTutorialsSaga(),
    GetMagicianCategoriesVideosSaga(),
    GetVideoReviewsSaga(),
    CreateVideoReviewSaga(),
    GetPageVideoSaga(),

    /* User watchers */
    AddToWishListSaga(),
    RemoveFromWishListSaga(),
    trackVideoSaga(),
    getActiveProfileSaga(),
    likeVideoSaga(),
    disLikeVideoSaga(),
    UpdateProfileSaga(),
    GetSubProfileSaga(),
    DeleteProfileSaga(),
    AccountUpdateSaga(),
    PasswordUpdateSaga(),
    DeleteAccountSaga(),
  ];
}
