// @flow

import React, {Component, Fragment} from 'react';
import {Player} from 'video-react';
import RouterLink from 'react-router-dom/Link';

import {DottedSpinner} from '../../Spinner';

type Props = {
  settings: {
    homepage_video: {
      video: string,
      images: Object,
    },
    site_home_trailer_title: string,
    site_title: string,
    site_subtitle: string,
  },
  isSettingsLoaded: () => boolean,
  getThumbURL: () => string,
  showSignIn: () => void,
}
type State = {
  spriteURL: string,
  player: ?Player,
}

class Home extends Component<Props, State> {
  state = {
    player: null,
    spriteURL: '/public/img/svg/sprite.svg',
  }

  onClose = () => {
    const {player} = this.state;

    if (player) {
      player.pause();
      player.load();
      player.toggleFullscreen();
    }
  }

  onPlayerRun = () => {
    const {player} = this.state;

    if (player) {
      player.play();
      player.toggleFullscreen();
    }
  }

  onSignIn = (e: Event) => {
    e.preventDefault();

    this.props.showSignIn();
  }

  setPlayerRef = (component: Player) => {
    this.setState({player: component});

    if (component) {
      component.subscribeToStateChange((state, prevState) => {
        const {
          hasStarted, isFullscreen, readyState,
        } = state;

        /* If video is out of fullscreen mode - close this video */
        if (
          (hasStarted && prevState.isFullscreen && !isFullscreen && readyState !== 0)
        ) {
          this.onClose();
        }
      });
    }
  }

  renderSVGIcon = (name: string) => {
    const svgURL = `${this.state.spriteURL}#${name}`;

    return (
      <svg role="img" title="arrow" className="icon-50 icon-white">
        <use xlinkHref={svgURL}/>
      </svg>
    );
  }

  renderControlls = () => (
    <div className="col-md-5 offset-md-1 basic-text">
      <ul className="advantages-home">
        <li>
          <span className="circle-2px-primary">
            {this.renderSVGIcon('hat')}
          </span>
          <span className="ml-2">
            Watch &amp; Learn Latest Tricks
          </span>
        </li>
        <li>
          <span className="circle-2px-primary">
            {this.renderSVGIcon('hand_heart')}
          </span>
          <span className="ml-2">Explore &amp; Follow Magicians</span>
        </li>
        <li>
          <span className="circle-2px-primary">
            {this.renderSVGIcon('magic_stars')}
          </span>
          <span className="ml-2">Engage with Magic Community</span>
        </li>
      </ul>

      <RouterLink className="btn-subscribe-home" to="/subscribe">
        Subscribe
      </RouterLink>
      <a
        className="btn-signin-home"
        href="/"
        onClick={this.onSignIn}
      >
        Sign in
      </a>
    </div>
  )

  renderVideoThumb = () => {
    const {getThumbURL, isSettingsLoaded} = this.props;

    return (
      <div
        className="img-adaptive-in"
        style={{
          backgroundImage: `url(/public/img/2.jpg)`
        }}
      >
        <img src={getThumbURL()} alt=""/>
      </div>
    );
  }

  renderPlayer = () => {
    const {
      settings: {homepage_video},
      getThumbURL,
    } = this.props;

    /* eslint camelcase: 0 */
    if (homepage_video) {
      const {video} = homepage_video;

      return (
        <Fragment>
          <Player
            ref={this.setPlayerRef}
            playsInline
            poster={getThumbURL()}
            src={video}
          />
          {/* <div className="video-react__close" onClick={this.onClose}>×</div> */}
        </Fragment>
      );
    }

    return this.renderVideoThumb();
  }

  renderVideoBlock = () => {
    const {
      settings: {
        site_home_trailer_title,
      },
    } = this.props;

    return (
      <div className="col-md-5 video-home-wr">
        <div className="video-home">
          {this.props.isSettingsLoaded() &&
            <div className="play-icon-outer">
              <span>
                <a
                  href="/#"
                  className="play-icon-red"
                  onClick={this.onPlayerRun}
                >
                  <i className="fa fa-play"/>
                </a>
              </span>
            </div>
          }
          <div className="cover-player-img img-adaptive">
            <div className="img-adaptive-in">
              {this.renderPlayer()}
            </div>
          </div>
          {this.renderVideoThumb()}
        </div>

        <div className="video-home-slogan animated bounce">
          {site_home_trailer_title}
        </div>
      </div>
    );
  }

  render() {
    const {
      settings: {
        site_title,
        site_subtitle,
      },
    } = this.props;

    return (
      <div className="landing-image bg-img">
        <div className="basic-landing-image">
          <div className="container-fluid">
            <div className="row text-wrap-home align-items-start">
              <div className="col-md-10 offset-md-1 basic-text text-center">
                <h1 className="basic-title">Are You in The League of Extraordinary Magicians?</h1>
                <p className="basic-para">
                  100 years of protected magic secrets finally revealed by the
                  true creators and best masters in this era.
                  With world recognized cardistry masters giving out secrets on
                  how to become and expert yourself.
                  Learn practical, fun and life changing skills watching 30+ magic
                  disciplines with over 10,000 video tutorials, tv shows and live performances
                </p>
              </div>
              {this.renderControlls()}
              {this.renderVideoBlock()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
