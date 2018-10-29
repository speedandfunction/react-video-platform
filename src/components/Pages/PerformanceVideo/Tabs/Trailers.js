/* @flow */

import React, {Component} from 'react';
import Slider from 'react-slick';
import classnames from 'classnames';

import {introSlider, sliderCommon} from '../../../../config';
import Trailer from '../../../Trailer';

type Props = {
  settings: {
    cdn_url: string,
  },
  media: {
    pageVideo: {
      title: string,
      watch_count: number,
      likes_count: number,
      dislikes_count: number,
      publish_time: string,
      duration: string,
      description: string,
      ratings: number,
      series: Object,
    }
  },
  addToWishList: ({id: string}) => void,
  removeFromWishList: ({id: string}) => void,
  track: ({hash: string, time: number}) => void,
  loadCardVideo: ({id: string}) => void,
  clearCardVideo: () => void,
}
type State = {
  sliderSettings: Object,
  isVideoTabVisible: boolean,
}

class TrailerTab extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isVideoTabVisible: false,
      sliderSettings: {...introSlider, arrows: true},
    };
  }

  getTrailers = () => {
    const {media: {pageVideo}} = this.props;
    const trailers = [];

    pageVideo.series.seasons.forEach((season) => {
      season.series.forEach((item) => {
        if (item.trailer_video) {
          trailers.push({
            ...item,
            video: item.trailer_video,
          });
        }
      });
    });

    return trailers;
  }

  renderTrailers = () => {
    const {settings} = this.props;
    const trailers = this.getTrailers();

    if (!trailers.length) {
      return (
        <div className="tab-pane tab-pane-video fade active show">
          <div className="related-tutorials-string">
            No trailers
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
            {trailers.map(video => (
              <Trailer
                settings={settings}
                trailer={video}
              />
            ))}
          </Slider>
        </div>
      </div>
    );
  }

  render() {
    return (
      [this.renderTrailers()]
    );
  }
}

export default TrailerTab;
