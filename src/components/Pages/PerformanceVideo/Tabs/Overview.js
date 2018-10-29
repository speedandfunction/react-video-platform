/* @flow */

import React, {Component} from 'react';
import RouterLink from 'react-router-dom/Link';

import Rating from '../../../VideoCard/Rating';

type Props = {
  isMuted: boolean,
  isPlaying: boolean,
  settings: {
    categories: [Object],
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
  onVideoMute: () => void,
  onMainVideoPlay: () => void,
  onLike: () => void,
  onDisLike: () => void,
  openReview: () => void,
}

const DESCRIPTION_MAX_LENGTH = 200;

class OverviewTab extends Component<Props> {
  getSeriesInfo = () => {
    const {media: {pageVideo}} = this.props;

    let seasonNumber;
    let seriesNumber;
    let currentSeries;

    /* eslint no-plusplus: 0 */
    if (pageVideo.series) {
      pageVideo.series.seasons.forEach((season, seasonIndex) => {
        season.series.forEach((item, seriesIndex) => {
          if (item.series_id === pageVideo.series_id) {
            seasonNumber = ++seasonIndex;
            seriesNumber = ++seriesIndex;
            currentSeries = item;
          }
        });
      });
    }

    return {seasonNumber, seriesNumber, currentSeries};
  }

  getPerformanceCategory = () => {
    const {
      settings: {categories},
      media: {pageVideo}
    } = this.props;
    let video;
    let videoCategory;

    pageVideo.series.seasons.forEach((season) => {
      season.series.forEach((item) => {
        if (item.series_id === pageVideo.series_id) {
          video = item;
        }
      });
    });

    categories.forEach((category) => {
      if (category.name === 'Magic Performances') {
        category.subcategories.forEach((subcategory) => {
          subcategory.videos.forEach((item) => {
            if (!videoCategory && item.v_id === video.id) {
              videoCategory = subcategory;
            }
          });
        });
      }
    });

    return videoCategory;
  }

  renderOverview = () => {
    const {
      media: {pageVideo},
      isMuted, isPlaying,
    } = this.props;
    const {
      title, watch_count, likes_count, dislikes_count,
      publish_time, duration, description, ratings, series,
    } = pageVideo;

    if (!series) {
      return false;
    }

    const descriptionCutted = description.length > DESCRIPTION_MAX_LENGTH
      ? `${description.substr(0, DESCRIPTION_MAX_LENGTH)}...`
      : description;

    const {seasonNumber, seriesNumber} = this.getSeriesInfo();
    const category = this.getPerformanceCategory();

    return (
      <div className="tab-pane tab-pane-video fade active show">
        <h1 className="tabs-video-title">{series.name}</h1>
        <h2 className="tabs-video-title-secondary">{title}</h2>
        <span className="perf-info">
          <span className="text-avenir-medium">Season {seasonNumber}</span>
          <i className="fas fa-circle"/>
          <span className="text-avenir-medium">Series {seriesNumber}</span>
          <i className="fas fa-circle"/>
          <RouterLink to={`/category/${category.id}`}>
            {category.name}
          </RouterLink>
        </span>
        <div className="row">
          <div className="col-md-6">
            <p className="video-details-add-info mb-2">
              <span onClick={this.props.openReview}>
                <Rating ratings={ratings}/>
              </span>
              <span className="views-count">
                <i className="fa fa-eye"/>&nbsp;{watch_count}
              </span>
              <span className="video-like-dis">
                <span className="mr-2" onClick={this.props.onLike}>
                  <i className="fa fa-thumbs-up"/>
                  <span>{likes_count}</span>
                </span>
                <span className="mr-2" onClick={this.props.onDisLike}>
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
              onClick={this.props.onVideoMute}
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
              <a href="/#" className="btn-circle-play" onClick={this.props.onMainVideoPlay}>
                <span className="fa-stack fa-4x">
                  <i className="fas fa-circle fa-stack-2x"/>
                  <i className="fas fa-play fa-stack-1x text-red"/>
                </span>
              </a>
            }
            {isPlaying &&
              <a href="/#" className="btn-circle-play" onClick={this.props.onMainVideoPlay}>
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

  render() {
    return (
      [this.renderOverview()]
    );
  }
}

export default OverviewTab;
