/* flow */

import React, {Component} from 'react';
import RouterLink from 'react-router-dom/Link';

import CategorySlider from './CategorySlider';

type Props = {
  settings: {
    categories: {
      data: Array,
    },
  },
  media: {
    cardVideo: {
      traker: string,
      video: string,
    },
  },
  loadCardVideo: ({id: string}) => void,
  clearCardVideo: () => void,
  addToWishList: ({id: string}) => void,
  removeFromWishList: ({id: string}) => void,
  track: ({hash: string, time: number}) => void,
  onIntroStop: () => void,
}

class Categories extends Component<Props> {
  getCategories = () => {
    const {
      settings: {
        categories,
      }
    } = this.props;
    let subCategories = [];

    categories.forEach((category) => {
      /* TODO: Remove this shit. Think how to modify BE structure */
      if (category.name !== 'Magic Performances') {
        subCategories = subCategories.concat(
          category.predefined,
          category.subcategories
        );
      }
    });

    return subCategories;
  }

  renderCategories = categories => (
    categories.map((category) => {
      if (category.videos && !category.videos.length) {
        return false;
      }

      if (!category.is_disabled_for_magicians) {
        return (
          <div className="sliders-section" key={category.id}>
            <div className="slider-row">
              <div className="head-slider">
                <h3>
                  {category.name}&nbsp;&nbsp;
                </h3>
                {category.videos &&
                  <RouterLink to={`category/${category.id}`}>
                    View all ({category.videos.length})
                  </RouterLink>
                }
              </div>

              <div className="row no-gutters video-slider">
                <div className="col-md-12 p-0">
                  <CategorySlider
                    settings={this.props.settings}
                    media={this.props.media}
                    loadCardVideo={this.props.loadCardVideo}
                    clearCardVideo={this.props.clearCardVideo}
                    addToWishList={this.props.addToWishList}
                    removeFromWishList={this.props.removeFromWishList}
                    category={category}
                    track={this.props.track}
                    onIntroStop={this.props.onIntroStop}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      }

      return false;
    })
  )

  render() {
    const subCategories = this.getCategories();

    return (
      [
        this.renderCategories(subCategories)
      ]
    );
  }
}

export default Categories;
