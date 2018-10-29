/* flow */

import React, {Fragment, Component} from 'react';
import Slider from 'react-slick';

import {CircleSpinner} from '../../Spinner';
import VideoCard from '../../VideoCard';
import {categorySlider} from '../../../config';

type Props = {
  needLoad: boolean,
  settings: {
    intros: {
      data: Array,
    }
  },
  category: Object,
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
  onIntroStop: () => void,
}

class CategorySlider extends Component<Props> {
  constructor(props) {
    super(props);

    this.sliderSettings = categorySlider;
  }

  onNextSlide = () => this.slider.current.slickNext();

  onPrevSlide = () => this.slider.current.slickPrev();

  slider: {current: null | HTMLDivElement}

  slider = React.createRef();

  render() {
    const {category} = this.props;
    const {
      settings, media,
      loadCardVideo, clearCardVideo, onIntroStop,
      addToWishList, removeFromWishList, track,
    } = this.props;

    if (!category.videos) {
      return (
        <div className="text-center">
          <CircleSpinner/>
        </div>
      );
    }

    const isSliderArrowsVisible = category.videos.length > this.sliderSettings.slidesToShow;

    return (
      <Fragment>
        <Slider
          ref={this.slider}
          {...this.sliderSettings}
        >
          {category.videos.map((video) => {
            if (!video) {
              return false;
            }

            const videoId = video.id || video.v_id;

            if (category.name === 'My Favorite') {
              video.in_user_wishlist = true;
            }

            return (
              <VideoCard
                url={`/tutorial-video/${category.id}/${videoId}`}
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
                onPlaying={onIntroStop}
              />
            );
          })}
        </Slider>
        {isSliderArrowsVisible &&
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
}

export default CategorySlider;
