/* @flow */

import React, {Component} from 'react';
import VideoCard from '../../VideoCard';

type Props = {
  match: {
    params: {
      cid: string,
    }
  },
  currentCategory: Object,
  settings: {
    cdn_url: string,
  },
  media: {
    cardVideo: {
      traker: string,
      video: string,
    },
  },
  clearCardVideo: () => void,
  loadCardVideo: ({id: string}) => void,
  addToWishList: ({id: string}) => void,
  removeFromWishList: ({id: string}) => void,
  track: ({hash: string, time: number}) => void,
}

class Categories extends Component<Props> {
  renderVideos = () => {
    const {
      match: {params: {cid}},
      currentCategory, settings, media,
      track, addToWishList, removeFromWishList,
      clearCardVideo, loadCardVideo,
    } = this.props;

    if (!currentCategory.videos) {
      return null;
    }

    let videoUrlPrefix;
    settings.categories.forEach((category) => {
      if (category.id === currentCategory.parent_id) {
        if (category.name === 'Magic Tutorials') {
          videoUrlPrefix = '/tutorial-video';
        } else {
          videoUrlPrefix = '/performance-video';
        }
      }
    });

    return currentCategory.videos.map((video) => {
      const videoId = video.id || video.v_id;

      console.log('+++', currentCategory, videoUrlPrefix)

      return (
        <div className="video-category__item video-animated">
          <VideoCard
            url={`${videoUrlPrefix}/${cid}/${videoId}`}
            key={videoId}
            video={video}
            settings={settings}
            media={media}
            loadCardVideo={loadCardVideo}
            clearCardVideo={clearCardVideo}
            canAddToFavorite={1}
            addToWishList={addToWishList}
            removeFromWishList={removeFromWishList}
            track={track}
          />
        </div>
      );
    });
  }

  render() {
    const {currentCategory} = this.props;

    return (
      <div className="video-category-wrapper text-center">
        <h1 className="video-category__header">
          {currentCategory.name}
        </h1>
        <div className="video-category text-center">
          {this.renderVideos()}
        </div>
      </div>
    );
  }
}

export default Categories;
