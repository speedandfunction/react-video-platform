/* @flow */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as SettingsActions from '../actions/settings';
import * as MediaActions from '../actions/media';
import * as UserActions from '../actions/user';
import Categories from '../components/Pages/Categories';
import {CircleSpinner} from '../components/Spinner';

type Props = {
  settings: {
    cdn_url: string,
    categories: Object,
  },
  media: {
    cardVideo: {
      traker: string,
      video: string,
    },
  },
  match: {
    params: {
      cid: string,
    }
  },
  clearCardVideo: () => void,
  loadCardVideo: ({id: string}) => void,
  addToWishList: ({id: string}) => void,
  removeFromWishList: ({id: string}) => void,
  track: ({hash: string, time: number}) => void,
}

class CategoryContainer extends Component<Props> {
  getCategoryById = (categories, id) => {
    let result;

    categories.forEach((category) => {
      const items = [].concat(category.subcategories, category.predefined);

      items.forEach((item) => {
        if (item.id.toString() === id) {
          result = {...item, parent_id: category.id};
        }
      });
    });

    return result;
  }

  getCurrentCategory = () => {
    const {
      match: {params: {cid}},
    } = this.props;
    const {settings: {categories}} = this.props;

    if (!categories) {
      return null;
    }
    return this.getCategoryById(categories, cid);
  }

  render() {
    const {
      match,
      settings, media,
      track, addToWishList, removeFromWishList,
      clearCardVideo, loadCardVideo
    } = this.props;
    const currentCategory = this.getCurrentCategory();

    if (!currentCategory || !currentCategory.videos) {
      return (
        <div className="video-category__loader text-center">
          <CircleSpinner/>
        </div>
      );
    }

    const {videos} = currentCategory;

    if (videos && !videos.length) {
      return (
        <div className="video-category__loader text-center">
          No Videos Found
        </div>
      );
    }

    return (
      <Categories
        match={match}
        settings={settings}
        media={media}
        currentCategory={currentCategory}
        removeFromWishList={removeFromWishList}
        addToWishList={addToWishList}
        loadCardVideo={loadCardVideo}
        clearCardVideo={clearCardVideo}
        track={track}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryContainer);
