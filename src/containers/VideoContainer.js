/* @flow */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as SettingsActions from '../actions/settings';
import * as MediaActions from '../actions/media';
import * as UserActions from '../actions/user';
import TutorialVideo from '../components/Pages/TutorialVideo';
import PerformanceVideo from '../components/Pages/PerformanceVideo';
import {CircleSpinner} from '../components/Spinner';

type Props = {
  settings: {
    cdn_url: string,
    categories: Object,
  },
  media: {
    cardVideo: {
      images: [string],
    },
  },
  match: {
    params: {
      vid: string,
      cid: string,
    },
    path: string,
  },
  loadCardVideo: ({id: string}) => void,
  addToWishList: ({id: string}) => void,
  removeFromWishList: ({id: string}) => void,
  track: ({hash: string, time: number}) => void,
  likeVideo: ({id: string}) => void,
  disLikeVideo: ({id: string}) => void,
  getReviews: ({id: string}) => void,
  createReview: ({text: string, rating: number}) => void,
  clearCardVideo: () => void,
  loadPageVideo: ({id: string}) => void,
  clearPageVideo: () => void,
}

class VideoContainer extends Component<Props> {
  componentDidMount() {
    const {
      clearPageVideo,
      loadPageVideo,
      match: {params: {vid}},
    } = this.props;

    clearPageVideo();
    loadPageVideo({id: vid});
  }

  getThumbURL = (images) => {
    const {
      settings: {cdn_url}
    } = this.props;

    return `${cdn_url}/images/320x200/${images['1']}`;
  }

  render() {
    const {
      match,
      settings, media,
      track, addToWishList, removeFromWishList,
      likeVideo, disLikeVideo, getReviews, createReview,
      loadCardVideo, clearCardVideo,
    } = this.props;

    if (!media.pageVideo || !settings.categories) {
      return (
        <div className="text-center loader__separator">
          <CircleSpinner/>
        </div>
      );
    }

    const componentParams = {
      match,
      settings,
      media,
      track,
      addToWishList,
      removeFromWishList,
      getThumbURL: this.getThumbURL,
      likeVideo,
      disLikeVideo,
      getReviews,
      createReview,
      loadCardVideo,
      clearCardVideo,
      videoParams: {cid: match.params.cid},
    };
    let component = null;

    if (/\/tutorial-video/.test(this.props.match.path)) {
      component = (
        <TutorialVideo {...componentParams}/>
      );
    } else {
      component = (
        <PerformanceVideo {...componentParams}/>
      );
    }

    return (
      <div className="video-page">
        {component}
      </div>
    );
  }
}

const mapStateToProps = ({settings, media}) => ({settings, media});
const mapDispatchToProps = dispatch => (
  {
    dispatch,
    ...bindActionCreators({
      ...SettingsActions,
      ...MediaActions,
      ...UserActions,
    }, dispatch)
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(VideoContainer);
