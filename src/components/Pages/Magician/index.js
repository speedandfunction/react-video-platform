import React, {Fragment, Component} from 'react';
import Slider from 'react-slick';
import {Player} from 'video-react';

import {urlThumbnailVideo} from '../../../utils/video';
import {CircleSpinner} from '../../../components/Spinner';
import VideoCard from '../../VideoCard';

type Props = {
  magician: {
    first_name: string,
    name: string,
  },
  media: {
    magicianCategoriesVideos: {
      tutotials: [Object],
      performance: [Object],
    }
  },
  settings: {
    cdn_url: string,
  },
  loadCardVideo: (id: string) => void,
  clearCardVideo: () => void,
  track: ({hash: string, time: number}) => void,
  loadTutorialsIntro: ({id: string}) => void,
}

const SLIDER_RENDER_DELAY = 200;

class MagicianPage extends Component<Props> {
  constructor(props) {
    super(props);

    this.sliderSettings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
      adaptiveHeight: true,
    };
  }

  onNextSlide = type => this[`${type}Slider`].current.slickNext();

  onPrevSlide = type => this[`${type}Slider`].current.slickPrev();

  onIntroPlay = () => {
    const {
      magician: {intro_id},
      loadTutorialsIntro
    } = this.props;

    loadTutorialsIntro({id: intro_id});

    this.player.current.play();
    this.player.current.toggleFullscreen();
    this.player.current.subscribeToStateChange((state, prevState) => {
      const {
        hasStarted, isFullscreen, currentSrc, readyState,
      } = state;

      /* If video is out of fullscreen mode - close this video */
      if (currentSrc) {
        if (
          (hasStarted && !isFullscreen && readyState !== 0) ||
          (!hasStarted && (prevState.isFullscreen === true && !isFullscreen) && readyState === 0)
        ) {
          this.player.current.pause();
        }
      }
    });
  }

  tutorialsSlider: {current: null | HTMLDivElement}

  tutorialsSlider = React.createRef();

  performanceSlider: {current: null | HTMLDivElement}

  performanceSlider = React.createRef();

  player: {current: null | HTMLDivElement}

  player = React.createRef();

  /*
    SHITTY BUGFIX. SOLUTION: REPLACE CURRENT SLIDER WITH ANOTHER ONE
    Bugfix for slider. Slider can't correctly calculate height in some cases
  */
  sliderFixes = (type) => {
    let interations = 20;

    const timer = setInterval(() => {
      const domEl = document.querySelector(`.${type}Slider .slick-list`);

      if (domEl) {
        const slide = domEl.querySelector('.slick-slide');

        if (slide) {
          domEl.style.height = `${slide.offsetHeight}px`;
        }
      }

      interations -= 1;

      if (interations === 0) {
        clearInterval(timer);
      }
    }, SLIDER_RENDER_DELAY);
  }

  renderWebLink = (magician) => {
    const {
      facebook_url, youtube_url, instagram_url, linkedin_url,
    } = magician;
    let {website} = magician;

    if (!magician.website) {
      website = facebook_url
        || youtube_url
        || instagram_url
        || linkedin_url
        || '';
    }

    return website.replace(/(^\w+:|^)\/\//, '');
  }

  renderAvatar = (magician) => {
    const {settings: {cdn_url, intros}} = this.props;
    const {
      media: {tutorialsIntro},
    } = this.props;

    if (!intros) {
      return (
        <div className="text-center loader__separator">
          <CircleSpinner/>
        </div>
      );
    }

    const intro = intros.data.find((item) => {
      if (item.magician.id === magician.id) {
        return item;
      }
      return false;
    });

    if (!intro) {
      return null;
    }

    const avatar = urlThumbnailVideo({cdn_url, images: intro.images, i: 1});

    return (
      <div className="magician-intro-video">
        <div
          className="play-icon-outer"
          onClick={this.onIntroPlay}
        >
          <span className="play-icon-red">
            <i className="fa fa-play"/>
          </span>
        </div>
        <div
          className="magician-intro-video-in"
          style={{backgroundImage: `url(${avatar})`}}
        />
        <Player
          ref={this.player}
          src={tutorialsIntro}
        />
      </div>
    );
  }

  renderIntro = magician => (
    <div className="col-6 col-lg-4">
      <div className="magician-thumbnail">
        <div className="magician-intro-video-wr">
          {this.renderAvatar(magician)}
          <svg role="img" title="welcome" className="icon-50 icon-white">
            <use xlinkHref="assets/img/svg.svg#welcome"/>
          </svg>
        </div>
        <div
          className="magician-thumbnail-in"
          style={{backgroundImage: `url(${magician.picture})`}}
        />
      </div>
    </div>
  );

  renderInfo = (magician) => {
    const {
      first_name, name, address, website, about_me,
    } = magician;
    const webLink = this.renderWebLink(magician);
    const hideSiteName = webLink && webLink.length > 30;

    return (
      <div className="col-6 col-lg-4 pl-0-mob">
        <div className="magician-info">
          <h1>
            {first_name} {name}
          </h1>
          <div className="row align-items-center magician-info-cont">
            <div className="col-md-auto text-nowrap">
              <i className="fa fa-map-marker-alt"/>
              {address}
            </div>
            <div className="col-md-auto text-nowrap">
              {hideSiteName &&
                <a href={website} target="_blank">
                  <i className="fa fa-link"/>
                </a>
              }
              {!hideSiteName &&
                <a href={website} target="_blank">
                  <i className="fa fa-link"/>
                  {webLink}
                </a>
              }
            </div>
          </div>
        </div>
        <div className="magician-descr" id="collapseDescrMagi">
          {about_me}
        </div>
      </div>
    );
  }

  renderSlider = (type) => {
    const {
      media: {
        magicianCategoriesVideos,
      },
    } = this.props;

    if (!magicianCategoriesVideos) {
      return (
        <div className="magician__slider-loader text-center">
          <CircleSpinner/>
        </div>
      );
    }

    const urlPrefix = type === 'tutorials'
      ? '/tutorial-video'
      : '/performance-video';

    return (
      <Slider
        ref={this[`${type}Slider`]}
        {...this.sliderSettings}
        className={`${type}Slider`}
        onReInit={() => this.sliderFixes(type)}
      >
        {magicianCategoriesVideos[type].data.map((video) => {
          const category = video.categories[0].category_id;
          const url = `${urlPrefix}/${category}/${video.id}`;

          return (
            <VideoCard
              url={url}
              key={video.id}
              video={video}
              settings={this.props.settings}
              media={this.props.media}
              loadCardVideo={this.props.loadCardVideo}
              clearCardVideo={this.props.clearCardVideo}
              track={this.props.track}
            />
          )
        })}
      </Slider>
    );
  }

  renderAmount = (type) => {
    const {media: {magicianCategoriesVideos}} = this.props;

    if (magicianCategoriesVideos) {
      const {[type]: {data}} = magicianCategoriesVideos;

      return (
        <span>{data.length || ': No videos'}</span>
      );
    }

    return null;
  }

  renderSliderButtons = (type) => {
    const {media: {magicianCategoriesVideos}} = this.props;

    if (magicianCategoriesVideos) {
      const {[type]: {data}} = magicianCategoriesVideos;

      if (data.length > this.sliderSettings.slidesToShow) {
        return (
          <Fragment>
            <button
              type="button"
              className="slick-prev-mf"
              onClick={() => this.onPrevSlide(type)}
            >
              <i className="fa fa-angle-left" aria-hidden="true"/>
            </button>
            <button
              type="button"
              className="slick-next-mf"
              onClick={() => this.onNextSlide(type)}
            >
              <i className="fa fa-angle-right" aria-hidden="true"/>
            </button>
          </Fragment>
        );
      }
    }

    return null;
  }

  renderSocial = () => {
    const {
      magician: {
        youtube_url,
        instagram_url,
        facebook_url,
        linkedin_url,
      }
    } = this.props;

    return (
      <div className="social-btns magician-social-btns">
        {facebook_url &&
          <a
            href={facebook_url}
            className="facebook-color"
            target="_blank"
          >
            <span className="fa-stack">
              <i className="circle-fa"/>
              <i className="fab fa-facebook fa-stack-1x"/>
            </span>
          </a>
        }
        {instagram_url &&
          <a
            href={instagram_url}
            className="instagram-color"
            target="_blank"
          >
            <span className="fa-stack">
              <i className="circle-fa"/>
              <i className="fab fa-instagram fa-stack-1x"/>
            </span>
          </a>
        }
        {youtube_url &&
          <a
            href={youtube_url}
            className="youtube-color"
          >
            <span className="fa-stack">
              <i className="circle-fa"/>
              <i className="fab fa-youtube fa-stack-1x"/>
            </span>
          </a>
        }
        {linkedin_url &&
          <a
            href={linkedin_url}
            className="twitter-color"
          >
            <span className="fa-stack">
              <i className="circle-fa"/>
              <i className="fab fa-linkedin fa-stack-1x"/>
            </span>
          </a>
        }
      </div>
    );
  }

  renderSidebar = () => (
    <div className="col-lg-4 col-md-12 magician-sidebar">
      <div className="white-box">

        <div className="mb-3">
          <h3 className="magician-title-slider">
            <i className="fa fa-file-video" aria-hidden="true"/>
            <span className="magician-title-slider__text">Tutorials</span>
            <span>{this.renderAmount('tutorials')}</span>
          </h3>
          <div className="row no-gutters slider-sidebar">
            <div className="col-md-12 p-0">
              {this.renderSlider('tutorials')}
              {this.renderSliderButtons('tutorials')}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <h3 className="magician-title-slider">
            <i className="fa fa-file-video" aria-hidden="true"/>
            <span className="magician-title-slider__text">Performances & TV Shows</span>
            <span>{this.renderAmount('performance')}</span>
          </h3>
          <div className="row no-gutters slider-sidebar">
            <div className="col-md-12 p-0">
              {this.renderSlider('performance')}
              {this.renderSliderButtons('performance')}
            </div>
          </div>
        </div>
      </div>

      {this.renderSocial()}
    </div>
  );

  render() {
    const {magician} = this.props;

    return (
      <div className="content-row bg-gray-light">
        <div className="content-cell">
          <div className="magician">
            <div className="container-fluid">
              <div className="row">
                {this.renderIntro(magician)}
                {this.renderInfo(magician)}
                {this.renderSidebar(magician)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MagicianPage;
