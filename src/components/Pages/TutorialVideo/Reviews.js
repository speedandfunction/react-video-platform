import React, {Component} from 'react';
import Rating from 'react-rating';

type Props = {
  reviews: [{
    user: {
      name: ?string,
    },
    rating: number,
    comment: string,
  }],
  cardVideo: {
    id: string,
  },
  createReview: ({text: string, rating: number}) => void,
  onClose: () => void,
}

type State = {
  text: string,
  rating: number,
  errors: [string],
}

class Reviews extends Component<Props, State> {
  state = {
    text: '',
    rating: 0,
    errors: [],
  }

  onFieldUpdate = (event) => {
    const {target: {value}} = event;

    this.setState({text: value});
  }

  onRatingUpdate = (rating) => {
    this.setState({rating});
  }

  sendReview = () => {
    const {cardVideo: {id}} = this.props;
    const {text, rating} = this.state;
    const errors = [];
    const MIN_COMMENT_LENGTH = 20;

    this.setState({errors: []}, () => {
      if (text.length < MIN_COMMENT_LENGTH) {
        errors.push('The minimum comment length is 20 characters');
      }

      if (!rating) {
        errors.push('Rate this video!');
      }

      this.setState({errors});

      if (!errors.length) {
        this.props.createReview({text, rating, id});

        this.setState({text: '', rating: 0});

        /* Animate scroll */
        setTimeout(() => {
          document.querySelector('.review-list').scrollTo({top: 9999});
        }, 1000);
      }
    });
  }

  renderReviews = () => (
    this.props.reviews.data.map((review) => {
      const name = (review.user && review.user.name) || 'John';

      return (
        <div className="user-review">
          <div className="user-review-name">{name}</div>
          <span className="user-review-rate">
            <Rating
              emptySymbol={
                <img src="/public/img/star.png" alt="" className="review-star"/>
              }
              fullSymbol={
                <img src="/public/img/star-full.png" className="review-star review-star__selected" alt=""/>
              }
              initialRating={review.rating}
              readonly
            />
          </span>
          <div className="user-review-comment">
            {review.comment}
          </div>
        </div>
      );
    })
  )

  render() {
    return (
      <div
        className="modal-review-video modal visible"
        id="reviewsPopUp"
      >
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Reviews</h5>
              <button type="button" className="close" onClick={this.props.onClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body container-fluid">
              <div className="row no-gutters review-list" id="review-list">
                <div className="col-12">
                  {this.renderReviews()}
                </div>
              </div>

              <div className="row no-gutters">
                <div className="col">
                  <textarea
                    rows="4"
                    value={this.state.text}
                    onChange={this.onFieldUpdate}
                  />
                  {this.state.errors.length &&
                    <ul>
                      {this.state.errors.map(error => (
                        <li className="text-red">
                          {error}
                        </li>
                      ))}
                    </ul>
                  }
                </div>
              </div>

              <div className="row no-gutters justify-content-between">
                <div className="col-auto">
                  <div className="stars">
                    <Rating
                      emptySymbol={
                        <img src="/public/img/star.png" alt="" className="review-star"/>
                      }
                      fullSymbol={
                        <img src="/public/img/star-full.png" className="review-star review-star__selected" alt=""/>
                      }
                      initialRating={this.state.rating}
                      onChange={this.onRatingUpdate}
                    />
                  </div>
                </div>
                <div className="col-auto">
                  <button
                    className="btn btn-review-video mr-1"
                    onClick={this.sendReview}
                  >
                    Send Review
                  </button>
                  <button
                    className="btn btn-close"
                    onClick={this.props.onClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Reviews;
