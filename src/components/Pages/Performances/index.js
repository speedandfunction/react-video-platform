/* @flow */

import React, {Component} from 'react';
import classnames from 'classnames';
import RouterLink from 'react-router-dom/Link';
import {Player} from 'video-react';

import {urlThumbnailVideo} from '../../../utils/video';
import PerformanceVideo from '../PerformanceVideo';
import Rating from '../../VideoCard/Rating';
import Categories from './Categories';

type Props = {
  match: {
    params: {
      vid: string,
      cid: string,
    },
  },
  settings: {
    cdn_url: string,
    categories: Object,
  },
  media: {
    cardVideo: {
      video: string,
    },
  },
  loadCardVideo: ({id: string}) => void,
  clearCardVideo: () => void,
  addToWishList: ({id: string}) => void,
  removeFromWishList: ({id: string}) => void,
  track: ({hash: string, time: number}) => void,
  getReviews: ({id: string}) => void,
  likeVideo: ({id: string}) => void,
  disLikeVideo: ({id: string}) => void,
  createReview: ({text: string, rating: number}) => void,
}

type State = {
  currentVideoIndex: number,
  isPlaying: boolean,
  isMuted: boolean,
  player: null,
  in_user_wishlist: boolean,
}

const DESCRIPTION_MAX_LENGTH = 200;

class PerformancesPage extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      currentVideoIndex: 0,
      isPlaying: false,
      isMuted: false,
      player: null,
    };

    const {in_user_wishlist} = this.getCurrentVideo();

    this.state.in_user_wishlist = in_user_wishlist;
  }

  onMainVideoPlay = () => {
    const {player} = this.state;
    const {v_id} = this.getCurrentVideo();

    this.setState({isPlaying: true});

    this.props.loadCardVideo({id: v_id});

    player.play();
    player.toggleFullscreen();
  }

  onVideoMute = () => {
    const {isMuted} = this.state;

    this.setState({isMuted: !isMuted}, () => {
      this.player.muted = !isMuted;
    });
  }

  onAddToFavs = () => {
    const {v_id} = this.getCurrentVideo();

    this.props.addToWishList({id: v_id});

    this.setState({in_user_wishlist: true});
  }

  onRemoveFromFavs = () => {
    const {v_id} = this.getCurrentVideo();

    this.props.removeFromWishList({id: v_id});

    this.setState({in_user_wishlist: false});
  }

  onNearestVideoShow = (event: Event, index) => {
    event.preventDefault();

    this.setState({currentVideoIndex: index});
  }

  setPlayerRef = (component: Player) => {
    this.setState({player: component});
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
    const {currentVideoIndex} = this.state;

    return category.videos[currentVideoIndex];
  }

  getThumbURL = (images) => {
    const {
      settings: {cdn_url}
    } = this.props;

    return `${cdn_url}/images/320x200/${images[0]}`;
  }

  getFeaturedCategory = () => {
    const {settings: {categories}} = this.props;
    let cid;

    categories.forEach((category) => {
      if (category.name === 'Magic Performances') {
        category.subcategories.forEach((subcategory) => {
          if (subcategory.name === 'Featured') {
            cid = subcategory.id;
          }
        });
      }
    });

    return cid;
  }

  getNearestVideos = (type) => {
    const {currentVideoIndex} = this.state;
    const {videos} = this.getFeaturedVideos();
    const categoryLength = videos.length;
    let index;

    if (type === 'next') {
      if (currentVideoIndex === categoryLength - 1) {
        index = 0;
      } else {
        index = currentVideoIndex + 1;
      }
    } else if (type === 'prev') {
      if (currentVideoIndex === 0) {
        index = categoryLength - 1;
      } else {
        index = currentVideoIndex - 1;
      }
    }

    return {...videos[index], index};
  }

  renderNearestVideo = (type) => {
    const {images, v_id, index} = this.getNearestVideos(type);
    const cid = this.getFeaturedCategory();
    const nearestUrl = `/performance-video/${cid}/${v_id}`;
    const cls = `leaner-black-l video-page__arrow-${type}`;

    return (
      <div
        className={`${type}-video`}
        style={{backgroundImage: `url(${this.getThumbURL(images)})`}}
      >
        <RouterLink
          to={nearestUrl}
          className={cls}
          onClick={e => this.onNearestVideoShow(e, index)}
        >
          <img src="/public/img/svg/right-arrow.svg" alt=""/>
        </RouterLink>
      </div>
    );
  }

  renderBackgroundImage = () => {
    const {settings: {cdn_url}} = this.props;
    const video = this.getCurrentVideo();
    let bgImage = '';

    if (video) {
      const {images} = video;

      /* When we'll have real Features 'i' should be removed */
      bgImage = urlThumbnailVideo({cdn_url, images, i: 0});
    }

    return (
      <div
        className="video-thumb-player img-adapt"
        style={{backgroundImage: `url(${bgImage})`}}
      />
    );
  }

  renderMainVideoPlayer = () => {
    const {isPlaying, isMuted} = this.state;
    const {media: {cardVideo}} = this.props;

    return (
      <div className="video-current__player-parent">
        <div
          className="video-current__player-wrapper"
          style={{opacity: isPlaying ? 1 : 0}}
        >
          <Player ref={this.setPlayerRef} playsInline preload="auto">
            {cardVideo &&
              <source src={cardVideo.video}/>
            }
          </Player>
          <div
            className={classnames('video-current__player-mute', {
              muteOff: isMuted
            })}
            onClick={this.onVideoMute}
          />
        </div>
      </div>
    );
  }

  renderSocialLinks = () => {
    const {location: {href}} = window;
    const {title} = this.getCurrentVideo();
    const facebookUrl = `http://www.facebook.com/sharer.php?u=${href}`;
    const pinterestUrl = `http://pinterest.com/pin/create/button/?url${href}&description=${title}`;
    const twitterUrl = `http://twitter.com/share?text=${title}&url=${href}`;
    const googleUrl = `https://plus.google.com/share?url=${href}&text=${title}`;

    return (
      <div className="video-details-social">
        <label className="d-none d-md-block">Share:</label>
        <a
          href={facebookUrl}
          className="fa-stack fa-lg facebook-color"
          aria-hidden="true"
        >
          <i className="square-fa"/>
          <i className="fab fa-facebook fa-stack-1x"/>
        </a>
        <a
          href={pinterestUrl}
          className="fa-stack fa-lg pinterest-color"
          aria-hidden="true"
        >
          <i className="square-fa"/>
          <i className="fab fa-pinterest fa-stack-1x"/>
        </a>
        <a
          href={twitterUrl}
          className="fa-stack fa-lg twitter-color"
          aria-hidden="true"
        >
          <i className="square-fa"/>
          <i className="fab fa-twitter fa-stack-1x"/>
        </a>
        <a
          href={googleUrl}
          className="fa-stack fa-lg google-color"
          aria-hidden="true"
        >
          <i className="square-fa"/>
          <i className="fab fa-google fa-stack-1x"/>
        </a>
      </div>
    );
  }

  renderVideoDetails = () => {
    const {in_user_wishlist} = this.state;

    const {
      title, watch_count, likes_count, dislikes_count,
      publish_time, duration, description, ratings,
    } = this.getCurrentVideo();

    const descriptionCutted = description.length > DESCRIPTION_MAX_LENGTH
      ? `${description.substr(0, DESCRIPTION_MAX_LENGTH)}...`
      : description;

    return (
      <div className="video-details">
        <div className="row justify-content-between m-0">
          <div className="col-6 col-md-2 order-2 order-md-1 order-4 prev-video-wr pl-0">
            {this.renderNearestVideo('prev')}
          </div>

          <div className="col-md-5 order-1 order-md-1 video-details-overview">
            <h3 className="video-details-title">{title}</h3>
            <p className="video-details-add-info">
              <Rating ratings={ratings}/>
              <span className="views-count">
                <i className="fa fa-eye"/>&nbsp;{watch_count}
              </span>
              <span className="video-like-dis">
                <span className="mr-2">
                  <i className="fa fa-thumbs-up"/>
                  <span id="like_count_124">
                    {likes_count}
                  </span>
                </span>
                <span className="mr-2">
                  <i className="fa fa-thumbs-down"/>
                  <span id="like_count_123">
                    {dislikes_count}
                  </span>
                </span>
              </span>
              <br/>
              <i className="fa fa-clock-o" aria-hidden="true"/>
              <span>&nbsp;{publish_time}</span>
              <i className="fa fa-video-camera" aria-hidden="true"/>
              <span>&nbsp;{duration}</span>
            </p>
            <p className="video-details-descr">
              {descriptionCutted}
            </p>
          </div>

          <div className="col-md-auto order-3">
            <div className="row align-items-center h-100">
              <div className="col d-flex flex-row flex-md-column align-items-end justify-content-between video-details-btns">
                <div className="video-details-add-btns">
                  {!in_user_wishlist &&
                    <button className="btn btn-add-to-watch" onClick={this.onAddToFavs}>
                      Add to Favorite
                    </button>
                  }
                  {in_user_wishlist &&
                    <button className="btn btn-add-to-watch" onClick={this.onRemoveFromFavs}>
                      Remove to Favorite
                    </button>
                  }
                </div>
                {this.renderSocialLinks()}
              </div>
            </div>
          </div>

          <div className="col-6 col-md-2 next-video-wr order-4 pr-0">
            {this.renderNearestVideo('next')}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      match,
      settings, media,
      track, addToWishList, removeFromWishList,
      likeVideo, disLikeVideo, getReviews, createReview,
      loadCardVideo, clearCardVideo,
    } = this.props;
    const videoParams = {
      cid: this.getFeaturedCategory(),
    };

    return (
      <div className="content magic-performances">
        <div className="container-fluid pt-0">
          <div className="row">
            <div className="col-md-12 p-0">
              <PerformanceVideo
                videoParams={videoParams}
                match={match}
                settings={settings}
                media={media}
                track={track}
                addToWishList={addToWishList}
                removeFromWishList={removeFromWishList}
                getThumbURL={this.getThumbURL}
                likeVideo={likeVideo}
                disLikeVideo={disLikeVideo}
                getReviews={getReviews}
                createReview={createReview}
                loadCardVideo={loadCardVideo}
                clearCardVideo={clearCardVideo}
              />
            </div>
          </div>
          <div>
            {this.props.settings.categories &&
              <Categories
                settings={this.props.settings}
                media={this.props.media}
                loadCardVideo={this.props.loadCardVideo}
                clearCardVideo={this.props.clearCardVideo}
                addToWishList={this.props.addToWishList}
                removeFromWishList={this.props.removeFromWishList}
                track={this.props.track}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default PerformancesPage;
