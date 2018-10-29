/* @flow */

import React, {Component} from 'react';
import classnames from 'classnames';
import RouterLink from 'react-router-dom/Link';

import {urlThumbnailVideo} from '../../utils/video';

type Props = {
  search: {
    videos: Object,
  },
  settings: {
    cdn_url: string,
  },
  searchVideos: ({value: string}) => void,
  clearSearch: () => void,
}
type State = {
  value: string,
  isSearchOpened: boolean,
  isSearchClearVisible: boolean,
}

const config = {
  descLength: 70,
  thumbSize: '320x200',
};

class Search extends Component<Props, State> {
  state = {
    value: '',
    isSearchOpened: false,
    isSearchClearVisible: false,
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.onResultsOutsideClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onResultsOutsideClick, false);
  }

  onSearchOpen = () => {
    const {isSearchOpened} = this.state;

    this.setState({
      isSearchOpened: !isSearchOpened,
    }, () => {
      /* $FlowFixMe */
      this.searchRef.current.focus();
    });
  }

  /* TODO: Implement debouncing */
  onSearchInput = () => {
    /* $FlowFixMe */
    const {value} = this.searchRef.current;

    if (value !== '') {
      this.props.searchVideos({value});
      this.setState({value, isSearchClearVisible: true});
    } else {
      this.props.clearSearch();
      this.setState({value: '', isSearchClearVisible: false});
    }
  }

  onResultsOutsideClick = (event: Event) => {
    /* $FlowFixMe */
    if (event.target.closest('.search-header-results')) {
      this.onResultsHide();
      this.onNextTick(this.props.clearSearch);
      return;
    }

    if (this.state.isSearchOpened) {
      this.onResultsHide();
      this.props.clearSearch();
    }
  }

  onNextTick = (callback: () => void) => {
    setTimeout(callback, 300);
  }

  onResultsHide = () => {
    this.setState({
      value: '',
      isSearchClearVisible: false,
    });
  }

  searchRef: { current: null | HTMLDivElement }

  searchRef = React.createRef();

  createVideoURL = (videoId, categoriesList) => {
    const categoryId = categoriesList[0].category_id;
    const {settings: {categories}} = this.props;
    let urlPrefix;

    categories.forEach((category) => {
      const items = [].concat(category.subcategories, category.predefined);

      items.forEach((item) => {
        if (item.id === categoryId) {
          if (category.name === 'Magic Performances') {
            urlPrefix = '/performance-video';
          } else {
            urlPrefix = '/tutorial-video';
          }
        }
      });
    });

    return `${urlPrefix}/${categoryId}/${videoId}`;
  }

  renderSearchResults = () => {
    const {
      search: {videos},
      settings: {cdn_url},
    } = this.props;

    if (!videos.data.length) {
      return null;
    }

    return (
      <div
        className="search-header-results d-block"
      >
        <ul>
          {videos.data.map(({
            title, description, images, id, categories,
          }, i) => {
            const key = `index_${i}`;
            const {thumbSize, descLength} = config;
            const src = urlThumbnailVideo({
              cdn_url,
              images,
              i: 1,
              size: thumbSize,
            });
            const _description = description.length > descLength
              ? `${description.substr(0, descLength)}...`
              : description;
            const videoUrl = this.createVideoURL(id, categories);

            return (
              <li key={key}>
                <RouterLink className="clearfix" to={videoUrl}>
                  <span className="search-header-results-thumb">
                    <img src={src} alt=""/>
                  </span>
                  <span className="search-header-results-content">
                    <span className="search-header-results-title">{title}</span>
                    <span className="search-header-results-descr">{_description}</span>
                  </span>
                </RouterLink>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div className="search-header">
        <input
          type="text"
          name="search"
          placeholder="Search..."
          ref={this.searchRef}
          className={
            classnames({
              'opened-input-search': this.state.isSearchOpened,
            })
          }
          value={this.state.value}
          onChange={this.onSearchInput}
        />
        <button
          className="btn btn-search"
          onClick={this.onSearchOpen}
        >
          <svg role="img" title="search" className="icon-30 icon-white">
            <use xlinkHref="/public/img/svg/sprite.svg#search_left"/>
          </svg>
        </button>

        {this.state.isSearchClearVisible &&
          <button
            type="button"
            className="inp-clear-txt"
            onClick={this.onResultsHide}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        }

        {this.renderSearchResults()}
      </div>
    );
  }
}

export default Search;
