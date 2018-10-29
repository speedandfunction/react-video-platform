/* @flow */

import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as AuthActions from '../actions/auth';
import * as SettingsActions from '../actions/settings';
import * as MediaActions from '../actions/media';
import * as UserActions from '../actions/user';
import PerformancesPage from '../components/Pages/Performances/';
import Layout from '../layout';
import {CircleSpinner} from '../components/Spinner';

type Props = {
  settings: {
    cdn_url: string,
    categories: Object,
  },
  media: {
    performanceIntro: Object,
    cardVideo: Object,
  },
  clearCardVideo: () => void,
  loadCardVideo: ({id: string}) => void,
  addToWishList: ({id: string}) => void,
  removeFromWishList: ({id: string}) => void,
  track: ({hash: string, time: number}) => void,
  loadCategoryVideos: (category: Object) => void,
  getReviews: ({id: string}) => void,
  clearPageVideo: () => void,
  loadPageVideo: ({id: string}) => void,
  likeVideo: ({id: string}) => void,
  disLikeVideo: ({id: string}) => void,
}

class PerformanceContainer extends PureComponent<Props> {
  constructor(props) {
    super(props);

    if (this.props.settings.categories) {
      const {v_id} = this.getCurrentVideo();

      this.props.clearPageVideo();
      this.props.loadPageVideo({id: v_id});
    }
  }

  componentDidUpdate({settings}) {
    if (!settings.categories && this.props.settings.categories) {
      const {v_id} = this.getCurrentVideo();

      this.props.clearPageVideo();
      this.props.loadPageVideo({id: v_id});
    }
  }

  getFeaturedVideos = () => {
    const {settings: {categories}} = this.props;
    let featured = null;

    categories.forEach((category) => {
      if (category.name === 'Magic Performances') {
        category.subcategories.forEach((subcategory) => {
          if (subcategory.name === 'Featured') {
            featured = subcategory;
          }
        });
      }
    });

    return featured;
  }

  getCurrentVideo = () => {
    const category = this.getFeaturedVideos();

    return category.videos[0];
  }

  render() {
    const {settings, media} = this.props;

    if (!settings.categories || !media.pageVideo) {
      return (
        <div className="content magic-tutorials magic-tutorials_type_loading text-center">
          <CircleSpinner/>
        </div>
      );
    }

    return (
      <Layout className="manage-performances__wrapper video-page">
        <PerformancesPage
          settings={settings}
          media={media}
          loadCardVideo={this.props.loadCardVideo}
          clearCardVideo={this.props.clearCardVideo}
          loadCategoryVideos={this.props.loadCategoryVideos}
          addToWishList={this.props.addToWishList}
          removeFromWishList={this.props.removeFromWishList}
          track={this.props.track}
          getReviews={this.props.getReviews}
          likeVideo={this.props.likeVideo}
          disLikeVideo={this.props.disLikeVideo}
        />
      </Layout>
    );
  }
}

const mapStateToProps = ({settings, auth, media}) => ({settings, auth, media});
const mapDispatchToProps = dispatch => (
  {
    dispatch,
    ...bindActionCreators({
      ...AuthActions,
      ...MediaActions,
      ...SettingsActions,
      ...UserActions,
    }, dispatch)
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceContainer);
