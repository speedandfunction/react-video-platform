/* flow */

import React, {Component} from 'react';
import {Player} from 'video-react';

import {urlThumbnailVideo} from '../../utils/video';

type Props = {
  settings: {
    cdn_url: string,
  },
  trailer: {
    id: string,
    images: Array,
    title: string,
    video: string,
  },
}
type State = {
  player: Player,
  isPlaying: boolean,
}

class Trailer extends Component<Props, State> {
  state = {
    isPlaying: false,
  }

  onVideoPlay = (e: Event) => {
    e.preventDefault();

    this.setState({isPlaying: true});
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
      component.toggleFullscreen();
      component.play();

      component.subscribeToStateChange((state, prevState) => {
        const {
          hasStarted, isFullscreen, currentSrc, readyState,
        } = state;

        /* If video is out of fullscreen mode - close this video */
        if (currentSrc) {
          if (
            (hasStarted && !isFullscreen && readyState !== 0) ||
            (!hasStarted && (prevState.isFullscreen === true && !isFullscreen) && readyState === 0)
          ) {
            this.setState({isPlaying: false});
          }
        }
      });
    }
  }

  render() {
    const {
      settings: {cdn_url},
      trailer: {
        images, title, video,
      },
    } = this.props;
    const {isPlaying} = this.state;
    const url = `${cdn_url}/${video}`;

    let thumbSrc = this.getMagiciansSliderSrc(images);

    if (!thumbSrc) {
      thumbSrc = '/public/img/media-default-thumbnail-url-video.jpg';
    }

    return (
      <div className="card-video-item video-box-outer">
        <div className="video-box-in">
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
            </div>
          </div>
          <div className="tile-details">
            <span className="d-block">
              <a href="/#" onClick={this.onVideoPlay}>
                <div className="hover-icon">
                  <i className="fa fa-play"/>
                </div>
              </a>
            </span>
            <div className="tile-content">
              <h3 className="tile-tit">{title}</h3>
            </div>
          </div>
        </div>

        {isPlaying &&
          <Player ref={this.setPlayerRef} playsInline autoPlay preload="auto">
            <source src={url}/>
            <div className="player-logo"/>
          </Player>
        }
      </div>
    );
  }
}

export default Trailer;
