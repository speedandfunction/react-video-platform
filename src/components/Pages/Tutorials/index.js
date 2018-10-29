/* flow */

import React, {Component} from 'react';
import {Player, ControlBar} from 'video-react';
import classnames from 'classnames';

import {introConfig} from '../../../config';
import {urlThumbnailVideo} from '../../../utils/video';
import IntroVideoSlider from './IntroVideoSlider';
import Categories from './Categories';

type Props = {
  settings: {
    cdn_url: string,
    intros: {
      data: Array,
    },
    isMobile: boolean,
  },
  media: {
    currentIntro: {
      magician: {
        id: string,
      },
      id: string,
      images: Object,
    },
    tutorialsIntro: string,
    magicianVideos: Object,
  },
  loadTutorialsIntro: ({id: string}) => void,
  loadCardVideo: ({id: string}) => void,
  clearCardVideo: () => void,
  loadMagicianTutorials: ({id: string}) => void,
  setCurrentIntro: ({video: Object}) => void,
  clearTutorialsIntro: () => void,
  clearMagicianVideos: () => void,
  addToWishList: ({id: string}) => void,
  removeFromWishList: ({id: string}) => void,
  track: ({hash: string, time: number}) => void,
}
type State = {
  currentIntro: Object,
  player: null,
  isPlaying: boolean,
  timeout: Object,
  isMuted: boolean,
}

const INTO_PLAY_DELAY = introConfig.startDelay * 1000; // ms

class Tutorials extends Component<Props, State> {
  constructor(props) {
    super(props);

    const {media: {currentIntro}} = this.props;

    this.props.loadMagicianTutorials({
      id: currentIntro.magician.id
    });
  }

  state = {
    timeout: null,
    isMuted: false,
    isPlaying: false,
  }

  componentDidUpdate(prevState) {
    const {media} = this.props;
    const {timeout} = this.state;

    /* If Magician tutorial opened - reset into video */
    if (media.cardVideo && prevState.media.cardVideo) {
      if (media.cardVideo.video !== prevState.media.cardVideo.video) {
        this.clearIntroMedia();
        clearInterval(timeout);
      }
    }

    /* If new Magician selected - reset into video timer */
    if (media.currentIntro !== prevState.media.currentIntro) {
      clearInterval(timeout);
      this.clearIntroMedia();
      this.runIntoTimer();
    }
  }

  onIntroStop = () => {
    const {player} = this.state;

    player.pause();
  }

  onVideoMute = () => {
    const {isMuted} = this.state;

    this.setState({isMuted: !isMuted}, () => {
      this.player.muted = !isMuted;
    });
  }

  getNextIntro = () => {
    const {
      settings: {intros: {data}},
      media: {currentIntro},
    } = this.props;
    let nextIntro = null;

    data.forEach((intro, index) => {
      if (
        (intro.id === currentIntro.id) && data[index + 1]
      ) {
        nextIntro = data[index + 1];
      }
    });

    return nextIntro;
  }

  getMainImageSrc = () => {
    const {settings: {cdn_url}} = this.props;
    const {media: {currentIntro: {images}}} = this.props;

    return urlThumbnailVideo({cdn_url, images, i: 1});
  }

  setPlayerRef = (component: Player) => {
    if (component) {
      this.setState({player: component}, () => {
        const {settings: {isMobile}} = this.props;

        /* Don't run intro on mobile */
        if (!isMobile) {
          this.runIntoTimer();
        }
      });

      component.subscribeToStateChange((state, prev) => {
        /* When into was finished */
        if (!prev.ended && state.ended) {
          const {
            clearMagicianVideos, setCurrentIntro, loadMagicianTutorials,
          } = this.props;
          const nextIntro = this.getNextIntro();

          if (nextIntro) {
            clearMagicianVideos();
            setCurrentIntro({video: nextIntro});
            loadMagicianTutorials({id: nextIntro.magician.id});
          }
        }
      });
    }

    this.player = component;
  }

  clearIntroMedia = () => {
    const {player} = this.state;

    player.pause();
    this.props.clearTutorialsIntro();
    this.setState({isPlaying: false});
  }

  runIntoTimer = () => {
    /* Video auto start in INTO_PLAY_DELAY seconds */
    const timeout = setTimeout(() => {
      const {player} = this.state;
      const {media: {currentIntro: {id}}} = this.props;

      if (player) {
        player.load();
        this.props.loadTutorialsIntro({id});
        player.play();
        player.toggleFullscreen();
        this.setState({isPlaying: true});
      }
    }, INTO_PLAY_DELAY);

    this.setState({timeout});
  }

  renderCategories = () => {
    const {settings: {categories: {data}}} = this.props;
    let subCategories = [];

    data.forEach((category) => {
      subCategories = subCategories.concat(category.categories_approved);
    });

    return subCategories.map(category => (
      <div className="sliders-section">
        <div className="slider-row">
          <div className="head-slider">
            <h3>
              {category.name}&nbsp;&nbsp;
              <i className="fa fa-angle-right"/>
            </h3>
            <a href="/#">View all ({category.total_videos})</a>
          </div>
        </div>
      </div>
    ));
  }

  render() {
    const {settings, media} = this.props;
    const {isMuted} = this.state;

    if (!settings.intros) {
      return null;
    }

    return (
      <div className="content magic-tutorials">
        <div className="container-fluid pt-0">
          <div className="row">
            <div className="col-md-12 p-0">
              <div className="video-current">
                <div className="video-current-in">

                  <div className="rotate-img-outer">
                    <div
                      className="rotate-img highlight-img bg-img first"
                      style={{backgroundImage: `url(${this.getMainImageSrc()})`}}
                    />
                  </div>

                  <IntroVideoSlider
                    settings={settings}
                    media={media}
                    loadCardVideo={this.props.loadCardVideo}
                    clearCardVideo={this.props.clearCardVideo}
                    loadMagicianTutorials={this.props.loadMagicianTutorials}
                    loadTutorialsIntro={this.props.loadTutorialsIntro}
                    setCurrentIntro={this.props.setCurrentIntro}
                    clearTutorialsIntro={this.props.clearTutorialsIntro}
                    clearMagicianVideos={this.props.clearMagicianVideos}
                    track={this.props.track}
                    onIntroStop={this.onIntroStop}
                  />

                  <div
                    className="video-current__player-wrapper"
                    style={{opacity: this.state.isPlaying ? 1 : 0}}
                  >
                    <Player ref={this.setPlayerRef} playsInline preload="auto">
                      {media.tutorialsIntro &&
                        <source src={media.tutorialsIntro}/>
                      }
                      <ControlBar disableCompletely/>
                    </Player>
                    <div
                      className={classnames('video-current__player-mute', {
                        muteOff: isMuted
                      })}
                      onClick={this.onVideoMute}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {settings.categories &&
            <Categories
              settings={settings}
              media={this.props.media}
              loadCardVideo={this.props.loadCardVideo}
              clearCardVideo={this.props.clearCardVideo}
              addToWishList={this.props.addToWishList}
              removeFromWishList={this.props.removeFromWishList}
              track={this.props.track}
              onIntroStop={this.onIntroStop}
            />
          }
        </div>
      </div>
    );
  }
}

export default Tutorials;
