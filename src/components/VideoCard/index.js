/* flow */

import React, {Component} from 'react';
import {Player} from 'video-react';
import RouterLink from 'react-router-dom/Link';

import {urlThumbnailVideo} from '../../utils/video';
import Rating from './Rating';
import {tracker} from '../../config';

type Props = {
  canAddToFavorite: number,
  settings: {
    cdn_url: string,
  },
  number: number,
  video: {
    id: ?string,
    v_id: ?string,
    images: Array,
    title: string,
    ratings: number,
    rate_count: number,
    in_user_wishlist: boolean,
  },
  media: {
    cardVideo: {
      traker: string,
      video: string,
    },
  },
  url: string,
  loadCardVideo: ({id: string}) => void,
  clearCardVideo: void,
  addToWishList: ({id: string}) => void,
  removeFromWishList: ({id: string}) => void,
  track: ({hash: string, time: number}) => void,
  onPlaying: () => void,
}
type State = {
  isPlaying: boolean,
  timer: null,
  trackStartTime: null,
  trackEndTime: null,
}

class VideoCard extends Component<Props, State> {
  state = {
    isPlaying: false,
  }

  onAddToFavorites = (e, id) => {
    e.stopPropagation();

    const parentId = this.getVideoParentId();

    this.props.addToWishList({id, parentId});
  }

  onRemoveFromFavorites = (e, id) => {
    e.stopPropagation();

    const parentId = this.getVideoParentId();

    this.props.removeFromWishList({id, parentId});
  }

  onVideoPlay = (e: Event, id: string) => {
    e.preventDefault();

    const {loadCardVideo, onPlaying} = this.props;

    this.setState({isPlaying: true}, () => {
      loadCardVideo({id});

      if (onPlaying) {
        onPlaying();
      }
    });
  }

  getVideoParentId = () => {
    const {video, settings: {categories}} = this.props;
    const currentVideoId = video.id || video.v_id;
    let parentCategory = null;

    categories.forEach((parent) => {
      const _categories = [].concat(parent.subcategories, parent.predefined);

      _categories.forEach((category) => {
        category.videos.forEach(({id, v_id}) => {
          const vid = id || v_id;

          if (vid === currentVideoId) {
            parentCategory = parent;
          }
        });
      });
    });

    return parentCategory.id;
  }

  getMagiciansSliderSrc = (images) => {
    const {settings: {cdn_url}} = this.props;

    if (!images || !cdn_url) {
      return null;
    }

    return urlThumbnailVideo({
      cdn_url, images, i: 0, size: '320x200',
    });
  }

  setPlayerRef = (component: Player) => {
    if (component) {
      component.play();
      component.toggleFullscreen();

      if (this.props.track) {
        this.runTracker();
      }

      component.subscribeToStateChange((state, prevState) => {
        const {
          hasStarted, isFullscreen, currentSrc, readyState,
        } = state;
        const {media: {cardVideo}} = this.props;

        /* If video is out of fullscreen mode - close this video */
        if (currentSrc) {
          if (
            (hasStarted && !isFullscreen && readyState !== 0) ||
            (!hasStarted && (prevState.isFullscreen === true && !isFullscreen) && readyState === 0)
          ) {
            this.setState({isPlaying: false}, () => {
              this.props.clearCardVideo();

              if (this.props.track) {
                this.stopTracker();

                this.props.track({
                  hash: cardVideo.tracker,
                  time: this.getViewTime(),
                });
                this.clearFromLS();
              }
            });
          }
        }
      });
    }
  }

  getViewTime = () => {
    const {trackStartTime, trackEndTime} = this.state;

    return Math.round((trackEndTime - trackStartTime) / 1000);
  }

  setToLS = (key, val) => {
    localStorage[key] = val;
  }

  clearFromLS = () => {
    delete localStorage.trackStartTime;
    delete localStorage.trackEndTime;
  }

  runTracker = () => {
    const trackStartTime = Date.now();

    this.setToLS('trackStartTime', trackStartTime);

    this.setState({trackStartTime});

    const timer = setInterval(() => {
      const trackEndTime = Date.now();

      this.setState({trackEndTime});

      this.setToLS('trackEndTime', trackEndTime);
    }, tracker.timeout);

    this.setState({timer});
  }

  stopTracker = () => {
    clearInterval(this.state.timer);
    this.setState({trackEndTime: Date.now()});
  }

  render() {
    const {
      url,
      canAddToFavorite,
      number,
      video: {
        id, v_id, images, title, ratings, rate_count, in_user_wishlist,
      },
      media: {cardVideo},
    } = this.props;
    const {isPlaying} = this.state;
    const videoId = id || v_id;

    let thumbSrc = this.getMagiciansSliderSrc(images);

    if (!thumbSrc) {
      thumbSrc = '/public/img/media-default-thumbnail-url-video.jpg';
    }

    return (
      <div className="card-video-item video-box-outer">
        <div className="video-box-in">
          {url &&
            <RouterLink to={url || '/#'} className="tile-permalink"/>
          }

          <div className="tile-media">
            <img
              className="tile-img image-preload"
              src={thumbSrc}
              alt=""
            />
          </div>

          <div className="tile-details-preview">
            <div className="tile-content">
              <h3 className="tile-tit">{title}</h3>
              <Rating
                ratings={ratings}
                rate_count={rate_count}
              />
              {number &&
                <span className="number-series">{number}</span>
              }
            </div>
          </div>
          <div className="tile-details">
            {canAddToFavorite && in_user_wishlist &&
              <button
                onClick={(e: Event) => this.onRemoveFromFavorites(e, videoId)}
                className="btn btn-add-to-watch-white"
              >
                <span>
                  <i className="fa fa-minus-circle"/>
                  Remove from Favorite
                </span>
              </button>
            }
            {canAddToFavorite && !in_user_wishlist &&
              <button
                onClick={(e: Event) => this.onAddToFavorites(e, videoId)}
                className="btn btn-add-to-watch-white"
              >
                <span>
                  <i className="fa fa-plus-circle"/>
                  Add to Favorite
                </span>
              </button>
            }
            <span className="d-block">
              <a href="/#" onClick={(e: Event) => this.onVideoPlay(e, videoId)}>
                <div className="hover-icon">
                  <i className="fa fa-play"/>
                </div>
              </a>
            </span>
            <div className="tile-content">
              <h3 className="tile-tit">{title}</h3>
              <Rating
                ratings={ratings}
                rate_count={rate_count}
              />
            </div>
          </div>
        </div>

        {isPlaying &&
          <Player ref={this.setPlayerRef} playsInline>
            {cardVideo && <source src={cardVideo.video}/>}
            <div className="player-logo"/>
          </Player>
        }
      </div>
    );
  }
}

export default VideoCard;
