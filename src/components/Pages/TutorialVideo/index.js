import React, {Component} from 'react';
import {Player, ControlBar} from 'video-react';
import classnames from 'classnames';
import Slider from 'react-slick';

import {urlThumbnailVideo} from '../../../utils/video';
import Reviews from './Reviews';
import VideoCard from '../../VideoCard';
import Rating from '../../VideoCard/Rating';
import {tracker, introSlider, sliderCommon} from '../../../config';

type Props = {
  match: {
    params: {
      vid: string,
      cid: string,
    },
  },
  settings: {
    cdn_url: string,
  },
  media: {
    cardVideo: {
      images: [string],
      video: string,
    },
    pageVideo: Object,
  },
  getThumbURL: (string) => string,
  addToWishList: ({id: string}) => void,
  removeFromWishList: ({id: string}) => void,
  track: ({hash: string, time: number}) => void,
  likeVideo: ({id: string}) => void,
  disLikeVideo: ({id: string}) => void,
  getReviews: ({id: string}) => void,
  createReview: ({text: string, rating: number}) => void,
  loadCardVideo: ({id: string}) => void,
  clearCardVideo: () => void,
}

type State = {
  trackStartTime: string,
  trackEndTime: string,
  isPlaying: boolean,
  in_user_wishlist: boolean,
  isReviewOpened: boolean,
  isMuted: boolean,
  tabs: {
    name: boolean,
  },
  isVideoTabVisible: boolean,
  sliderSettings: Object,
}

const DESCRIPTION_MAX_LENGTH = 200;

class TutorialVideo extends Component<Props, State> {
  constructor(props) {
    super(props);

    const {media: {pageVideo: {in_user_wishlist, id}}} = props;

    this.state = {
      isPlaying: false,
      in_user_wishlist,
      isReviewOpened: false,
      isMuted: false,
      tabs: {
        overview: true,
        related: false,
        details: false,
      },
      isVideoTabVisible: false,
      sliderSettings: {...introSlider, arrows: true},
    };

    this.props.getReviews({id});
  }

  onLike = () => {
    const {media: {pageVideo: {id}}} = this.props;

    this.props.likeVideo({id});
  }

  onDisLike = () => {
    const {media: {pageVideo: {id}}} = this.props;

    this.props.disLikeVideo({id});
  }

  onAddToFavs = () => {
    const {media: {pageVideo: {id}}} = this.props;

    this.props.addToWishList({id});

    this.setState({in_user_wishlist: true});
  }

  onRemoveFromFavs = () => {
    const {media: {pageVideo: {id}}} = this.props;

    this.props.removeFromWishList({id});

    this.setState({in_user_wishlist: false});
  }

  onMainVideoPlay = (e) => {
    e.preventDefault();

    const {player, isPlaying} = this.state;
    const {media: {pageVideo}} = this.props;

    if (!isPlaying) {
      player.play();
      player.toggleFullscreen();
      this.runTracker();
    } else {
      player.pause();
      this.stopTracker();

      this.props.track({
        hash: pageVideo.tracker,
        time: this.getViewTime(),
      });
    }

    this.setState({isPlaying: !isPlaying});
  }

  onReviewClose = () => {
    this.setState({isReviewOpened: false});
  }

  onVideoMute = (e) => {
    e.preventDefault();

    const {isMuted} = this.state;

    this.setState({isMuted: !isMuted}, () => {
      this.player.muted = !isMuted;
    });
  }

  onTabSelect = (event: Event) => {
    event.preventDefault();

    const {target: {name}} = event;

    this.setState({
      tabs: {
        overview: false,
        related: false,
        details: false,
        [name]: true,
      },
      isVideoTabVisible: false,
    });
  }

  getMainImageSrc = () => {
    const {settings: {cdn_url}} = this.props;
    const {media: {pageVideo: {images}}} = this.props;

    return urlThumbnailVideo({cdn_url, images, i: 0});
  }

  setPlayerRef = (component: Player) => {
    this.setState({player: component});

    if (component) {
      component.subscribeToStateChange((state) => {
        const {currentSrc} = state;
        const {media: {pageVideo}} = this.props;

        /* If video is out of fullscreen mode - close this video */
        if (currentSrc) {
          if (state.hasStarted && !state.paused && !this.state.isPlaying) {
            this.setState({isPlaying: true});
            this.runTracker();
          }

          if (state.hasStarted && state.paused && this.state.isPlaying) {
            this.setState({isPlaying: false});
            this.stopTracker();
            this.props.track({
              hash: pageVideo.tracker,
              time: this.getViewTime(),
            });
            this.clearFromLS();
          }
        }
      });
    }

    this.player = component;
  }

  getViewTime = () => {
    const {trackStartTime, trackEndTime} = this.state;

    return Math.round((trackEndTime - trackStartTime) / 1000);
  }

  getCategory = () => {
    const {
      match: {params},
      settings: {categories},
    } = this.props;
    const {cid} = params;
    let currentCategory = null;

    categories.forEach(({subcategories, predefined}) => {
      const items = [].concat(subcategories, predefined);

      items.forEach((category) => {
        if (category.id.toString() === cid) {
          currentCategory = category;
        }
      });
    });

    return currentCategory;
  }

  setToLS = (key, val) => {
    localStorage[key] = val;
  }

  openReview = () => {
    this.setState({isReviewOpened: true});
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

  clearFromLS = () => {
    delete localStorage.trackStartTime;
    delete localStorage.trackEndTime;
  }

  renderTabs = () => (
    <ul className="nav nav-tabs-video" role="tablist">
      <li className="nav-item nav-item-video">
        <a
          className={classnames('nav-link', {active: this.state.tabs.overview})}
          href="#overview"
          name="overview"
          onClick={this.onTabSelect}
        >
          Overview
        </a>
      </li>
      <li className="nav-item nav-item-video">
        <a
          className={classnames('nav-link', {active: this.state.tabs.related})}
          href="#related"
          name="related"
          onClick={this.onTabSelect}
        >
          Related Tutorials
        </a>
      </li>
      <li className="nav-item nav-item-video">
        <a
          className={classnames('nav-link', {active: this.state.tabs.details})}
          href="#details"
          name="details"
          onClick={this.onTabSelect}
        >
          Details
        </a>
      </li>
    </ul>
  )

  renderSocials = () => {
    const {location: {href}} = window;
    const {media: {pageVideo: {title}}} = this.props;
    const facebookUrl = `http://www.facebook.com/sharer.php?u=${href}`;
    const pinterestUrl = `http://pinterest.com/pin/create/button/?url${href}&description=${title}`;
    const twitterUrl = `http://twitter.com/share?text=${title}&url=${href}`;
    const googleUrl = `https://plus.google.com/share?url=${href}&text=${title}`;

    return (
      <div className="tabs-video-social">
        <a href={facebookUrl} className="fa-stack fa-lg facebook-color" aria-hidden="true">
          <i className="square-fa"/>
          <i className="fab fa-facebook fa-stack-1x"/>
        </a>
        <a href={pinterestUrl} className="fa-stack fa-lg pinterest-color" aria-hidden="true">
          <i className="square-fa"/>
          <i className="fab fa-pinterest fa-stack-1x"/>
        </a>
        <a href={twitterUrl} className="fa-stack fa-lg twitter-color" aria-hidden="true">
          <i className="square-fa"/>
          <i className="fab fa-twitter fa-stack-1x"/>
        </a>
        <a href={googleUrl} className="fa-stack fa-lg google-color" aria-hidden="true">
          <i className="square-fa"/>
          <i className="fab fa-google fa-stack-1x"/>
        </a>
      </div>
    );
  }

  renderOverview = () => {
    const {
      media: {pageVideo}
    } = this.props;
    const {
      title, watch_count, likes_count, dislikes_count,
      publish_time, duration, description, ratings,
    } = pageVideo;
    const {isMuted, isPlaying} = this.state;

    const descriptionCutted = description.length > DESCRIPTION_MAX_LENGTH
      ? `${description.substr(0, DESCRIPTION_MAX_LENGTH)}...`
      : description;

    return (
      <div className="tab-pane tab-pane-video fade active show">
        <h1 className="tabs-video-title">{title}</h1>
        <div className="row">
          <div className="col-md-6">
            <p className="video-details-add-info mb-2">
              <span onClick={this.openReview}>
                <Rating ratings={ratings}/>
              </span>
              <span className="views-count">
                <i className="fa fa-eye"/>&nbsp;{watch_count}
              </span>
              <span className="video-like-dis">
                <span className="mr-2" onClick={this.onLike}>
                  <i className="fa fa-thumbs-up"/>
                  <span>{likes_count}</span>
                </span>
                <span className="mr-2" onClick={this.onDisLike}>
                  <i className="fa fa-thumbs-down"/>
                  <span>{dislikes_count}</span>
                </span>
              </span>
              <span>
                <i className="fas fa-calendar" aria-hidden="true"/>&nbsp;{publish_time}
              </span>
              <span>
                <i className="fas fa-video" aria-hidden="true"/>&nbsp;{duration}
              </span>
            </p>
            <p className="video-details-descr">{descriptionCutted}</p>
          </div>
          <div className="col-md-6 text-right">
            <a
              href="/#"
              className="btn-circle-volume mr-md-3"
              onClick={this.onVideoMute}
            >
              <span className="fa-stack fa-2x">
                <i className="fas fa-circle fa-stack-2x"/>
                {!isMuted &&
                  <i className="fas fa-volume-up fa-stack-1x text-red"/>
                }
                {isMuted &&
                  <i className="fas fa-volume-off fa-stack-1x text-red"/>
                }
              </span>
            </a>
            {!isPlaying &&
              <a href="/#" className="btn-circle-play" onClick={this.onMainVideoPlay}>
                <span className="fa-stack fa-4x">
                  <i className="fas fa-circle fa-stack-2x"/>
                  <i className="fas fa-play fa-stack-1x text-red"/>
                </span>
              </a>
            }
            {isPlaying &&
              <a href="/#" className="btn-circle-play" onClick={this.onMainVideoPlay}>
                <span className="fa-stack fa-4x">
                  <i className="fas fa-circle fa-stack-2x"/>
                  <i className="fas fa-pause fa-stack-1x text-red"/>
                </span>
              </a>
            }
          </div>
        </div>
      </div>
    );
  }

  renderDetails = () => {
    const {
      media: {pageVideo: {title, subtitle, description}},
    } = this.props;

    return (
      <div className="tab-pane tab-pane-video fade active show">
        <div className="details">
          <div className="row">
            <div className="col-md-3">
              <h3 className="details-title">{title}</h3>
              {subtitle &&
                <p className="details-subtitle">{subtitle}</p>
              }
            </div>
            <div className="col-md-9">
              <div className="details-descr">
                <p>{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderRelated = () => {
    const {
      settings,
      media,
      loadCardVideo, clearCardVideo,
      addToWishList, removeFromWishList, track,
    } = this.props;
    const category = this.getCategory();

    if (!category) {
      return (
        <div className="tab-pane tab-pane-video fade active show">
          <div className="related-tutorials-string">
            No videos
          </div>
        </div>
      );
    }

    /*
      Special hack for 'slick slider' for beatifull slider opening process.
      Because by default slider calculating elements height pretty slow and
      elemnts are 'jumping'.
    */
    setTimeout(() => {
      this.setState({isVideoTabVisible: true});
    }, sliderCommon.fadeInTimeout);

    return (
      <div
        className={
          classnames(
            'tab-pane tab-pane-video p-0 fade active',
            {show: this.state.isVideoTabVisible}
          )
        }
      >
        <div className="related-tutorials-string">
          <Slider
            ref={this.slider}
            {...this.state.sliderSettings}
          >
            {category.videos.map((video) => {
              const videoId = video.id || video.v_id;

              return (
                <VideoCard
                  url={`/tutorial-video/${category.id}/${videoId}`}
                  key={videoId}
                  video={video}
                  settings={settings}
                  media={media}
                  loadCardVideo={loadCardVideo}
                  clearCardVideo={clearCardVideo}
                  addToWishList={addToWishList}
                  removeFromWishList={removeFromWishList}
                  track={track}
                />
              );
            })}
          </Slider>
        </div>
      </div>
    );
  }

  render() {
    const {
      in_user_wishlist, isReviewOpened,
    } = this.state;

    const {
      createReview,
      media: {pageVideo, cardVideoReviews}
    } = this.props;

    return (
      <div className="player-big player-big-tutorials">
        <Player
          ref={this.setPlayerRef}
          playsInline
          poster={this.getMainImageSrc()}
          preload={false}
        >
          {pageVideo.video &&
            <source src={pageVideo.video}/>
          }
          <ControlBar/>
        </Player>
        <div className="tabs-video tabs-video-bottom">
          <div className="container-fluid p-0">
            <div className="row no-gutters">
              <div className="col-md-12">
                <div className="tab-content tab-content-video">
                  {this.state.tabs.overview && this.renderOverview()}
                  {this.state.tabs.related && this.renderRelated()}
                  {this.state.tabs.details && this.renderDetails()}
                </div>
              </div>
              <div className="col-md-12">
                <div className="row no-gutters align-items-center justify-content-between">
                  <div className="col-lg-8">
                    {this.renderTabs()}
                  </div>
                  <div className="col-lg-4 btns-tabs-footer d-inline-flex justify-content-lg-end justify-content-center">
                    {!in_user_wishlist &&
                      <div className="video-details-add-btns mr-sm-4" onClick={this.onAddToFavs}>
                        <button className="btn btn-add-to-watch">Add to Favorite</button>
                      </div>
                    }
                    {in_user_wishlist &&
                      <div className="video-details-add-btns mr-sm-4" onClick={this.onRemoveFromFavs}>
                        <button className="btn btn-add-to-watch">Remove from Favorite</button>
                      </div>
                    }
                    {this.renderSocials()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isReviewOpened &&
          <Reviews
            cardVideo={pageVideo}
            reviews={cardVideoReviews}
            createReview={createReview}
            onClose={this.onReviewClose}
          />
        }
      </div>
    );
  }
}

export default TutorialVideo;
