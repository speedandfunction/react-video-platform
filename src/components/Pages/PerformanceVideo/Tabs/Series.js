/* @flow */

import React, {Component} from 'react';
import Slider from 'react-slick';
import classnames from 'classnames';

import {introSlider, sliderCommon} from '../../../../config';
import VideoCard from '../../../VideoCard';

type Props = {
  videoParams: {
    cid: string,
  },
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
  isDropDownVisible: boolean,
  isVideoTabVisible: boolean,
  sliderSettings: Object,
  videosData: {
    videos: Object,
    currentSeason: string,
  }
}

class SeriesTab extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isDropDownVisible: false,
      isVideoTabVisible: false,
      sliderSettings: {...introSlider, arrows: true},
      videosData: this.getSeriesData(),
      seasonsList: this.getSeasonsList(),
    };
  }

  onSeasonsShow = () => {
    const {isDropDownVisible} = this.state;

    this.setState({isDropDownVisible: !isDropDownVisible});
  }

  onSeasonChoose = (event: Event, seasonIndex: number) => {
    event.preventDefault();

    this.setState({
      isVideoTabVisible: false,
      isDropDownVisible: false,
      videosData: {
        videos: this.getSeasonByIndex(seasonIndex),
        currentSeason: `S${seasonIndex + 1}`,
      }
    });
  }

  getSeasonsList = () => {
    const {media: {pageVideo}} = this.props;
    const seasons = [];

    pageVideo.series.seasons.forEach((season, index) => {
      seasons.push(`Season ${index + 1}`);
    });

    return seasons;
  }

  getSeriesData = () => {
    const {
      media: {pageVideo},
      videoParams,
    } = this.props;
    const vid = parseInt(pageVideo.id, 10);
    const videos = [];
    let currentSeason;

    pageVideo.series.seasons.forEach((season, index) => {
      season.series.forEach((item) => {
        if (item.id === vid && !currentSeason) {
          currentSeason = index;
        }
      });
    });

    pageVideo.series.seasons[currentSeason].series.forEach((item) => {
      videos.push(item);
    });

    return {
      videos,
      currentSeason: `S${currentSeason + 1}`,
    };
  }

  getSeasonByIndex = (index: number) => {
    const {media: {pageVideo}} = this.props;
    const videos = [];

    pageVideo.series.seasons[index].series.forEach((item) => {
      videos.push(item);
    });

    return videos;
  }

  renderSeasonsDropDown = currentSeason => (
    <div className="btn-group dropup drop-series">
      <button type="button" className="btn btn-series dropdown-toggle" onClick={this.onSeasonsShow}>
        {currentSeason}
      </button>
      {this.state.isDropDownVisible &&
        <div className="dropdown-menu show">
          {this.state.seasonsList.map((season, i) => (
            <a
              href="/#"
              className="dropdown-item"
              onClick={e => this.onSeasonChoose(e, i)}
            >
              {season}
            </a>
          ))}
        </div>
      }
    </div>
  )

  renderSeries = () => {
    const {
      videoParams,
      settings, media,
      loadCardVideo, clearCardVideo,
      addToWishList, removeFromWishList, track,
    } = this.props;
    const {videosData: {videos, currentSeason}} = this.state;

    if (!videos.length) {
      return (
        <div className="tab-pane tab-pane-video fade active show">
          <div className="performances-series-string">
            No Series
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
        <div className="performances-series-string">
          <Slider
            ref={this.slider}
            {...this.state.sliderSettings}
          >
            {videos.map((video, index) => {
              const videoId = video.id || video.v_id;

              return (
                <VideoCard
                  url={`/performance-video/${videoParams.cid}/${videoId}`}
                  key={videoId}
                  video={video}
                  settings={settings}
                  media={media}
                  loadCardVideo={loadCardVideo}
                  clearCardVideo={clearCardVideo}
                  addToWishList={addToWishList}
                  removeFromWishList={removeFromWishList}
                  track={track}
                  number={index + 1}
                />
              );
            })}
          </Slider>
        </div>
        {this.renderSeasonsDropDown(currentSeason)}
      </div>
    );
  }

  render() {
    return (
      [this.renderSeries()]
    );
  }
}

export default SeriesTab;
