/* flow */

import React, {Fragment, Component} from 'react';
import Slider from 'react-slick';
import classnames from 'classnames';

import {CircleSpinner} from '../../Spinner';
import VideoCard from '../../VideoCard';
import {introSlider} from '../../../config';

type Props = {
  settings: {
    cdn_url: string,
    intros: [Object],
  },
  media: {
    cardVideo: {
      traker: string,
      video: string,
    },
    magicianVideos: Object,
  },
  loadCardVideo: (id: string) => void,
  clearCardVideo: void,
  loadMagicianTutorials: ({id: string}) => void,
  setCurrentIntro: ({video: Object}) => void,
  loadTutorialsIntro: ({id: string}) => void,
  clearMagicianVideos: () => void,
  track: ({hash: string, time: number}) => void,
  onIntroStop: () => void,
}
type State = {
  isMagicianListVisible: boolean,
}

class IntroVideoSlider extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isMagicianListVisible: false,
    };

    this.sliderSettings = introSlider;
  }

  onNextSlide = () => this.slider.current.slickNext();

  onPrevSlide = () => this.slider.current.slickPrev();

  onMagiciansListToggle = () => {
    const {isMagicianListVisible} = this.state;

    this.setState({
      isMagicianListVisible: !isMagicianListVisible,
    });
  }

  onMagicianChange = (e: Event, intro) => {
    e.preventDefault();

    const {
      setCurrentIntro,
      loadMagicianTutorials,
      clearMagicianVideos,
    } = this.props;

    clearMagicianVideos();
    setCurrentIntro({video: intro});
    loadMagicianTutorials({id: intro.magician.id});

    this.setState({isMagicianListVisible: false});
  }

  drawVideoCards = () => {
    const {
      settings, media,
      loadCardVideo, clearCardVideo, track,
    } = this.props;

    return media.magicianVideos.data.map(intro => (
      <VideoCard
        url={false}
        key={intro.id}
        video={intro}
        settings={settings}
        media={media}
        loadCardVideo={loadCardVideo}
        clearCardVideo={clearCardVideo}
        track={track}
        onPlaying={this.props.onIntroStop}
      />
    ));
  }

  slider: {current: null | HTMLDivElement}

  slider = React.createRef();

  /*
    BUGFIX for slider. Slider can't correctly calculate height in some cases
  */
  sliderFixes = () => {
    let interations = 20;

    const timer = setInterval(() => {
      const domEl = document.querySelector('.video-current-in .slick-list');

      if (domEl) {
        const slide = domEl.querySelector('.slick-slide');

        domEl.style.height = `${slide.offsetHeight}px`;
      }

      interations -= 1;

      if (interations === 0) {
        clearInterval(timer);
      }
    }, 200);
  }

  renderSlider = () => {
    const {media: {magicianVideos}} = this.props;
    const isSliderArrowVisible =
      (magicianVideos && magicianVideos.data.length) >
        this.sliderSettings.slidesToShow;

    return (
      <Fragment>
        {!this.props.media.magicianVideos &&
          <div className="text-center">
            <CircleSpinner/>
          </div>
        }

        {this.props.media.magicianVideos &&
          <Slider
            ref={this.slider}
            {...this.sliderSettings}
            onReInit={this.sliderFixes}
          >
            {this.drawVideoCards()}
          </Slider>
        }

        {isSliderArrowVisible &&
          <Fragment>
            <button
              type="button"
              className="slick-prev-mf"
              onClick={this.onPrevSlide}
            >
              <i className="fa fa-angle-left"/>
            </button>

            <button
              type="button"
              className="slick-next-mf"
              onClick={this.onNextSlide}
            >
              <i className="fa fa-angle-right"/>
            </button>
          </Fragment>
        }
      </Fragment>
    );
  }

  render() {
    const {settings: {intros}} = this.props;
    const {media: {currentIntro, magicianVideos}} = this.props;

    if (magicianVideos && !magicianVideos.data.length) {
      return false;
    }

    return (
      <div className="container-fluid slider-intro-wr">
        <div className="row align-items-center slider-intro-header">
          <div className="col-auto acquaintance">
            <span className="text-red">
              {"Hello, I'm"}
            </span>
            <div className="btn-group dropup magic-tutorials__dropdown">
              <button
                className="btn btn-sm dropdown-toggle btn-magicians"
                type="button"
                onClick={this.onMagiciansListToggle}
              >
                {currentIntro.magician.first_name} {currentIntro.magician.name}
              </button>

              <div
                className={classnames('dropdown-menu', {
                  show: this.state.isMagicianListVisible,
                })}
              >
                {intros.data.map(intro => (
                  <a
                    key={intro.id}
                    className="dropdown-item"
                    href="/#"
                    onClick={e => this.onMagicianChange(e, intro)}
                  >
                    {intro.magician.first_name} {intro.magician.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="col-auto">
            Watch my Tutorials
          </div>
        </div>

        <div className="row no-gutters">
          <div className="col">
            {this.renderSlider()}
          </div>
        </div>
      </div>
    );
  }
}

export default IntroVideoSlider;
