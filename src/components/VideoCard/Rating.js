/* flow */

import React from 'react';
import classnames from 'classnames';

type Props = {
  ratings: number,
}

function Rating(props: Props) {
  const ratingMax = 5;
  const {ratings} = props;
  const ratingInt = parseInt(ratings, 10);
  const rateArr = new Array(Math.ceil(ratingMax)).fill(true);

  return (
    <span className="video-rating">
      {rateArr.map((star, i) => {
        const key = `rating-${i}`;

        return (
          <i
            key={key}
            className={
              classnames(
                'fa rating-symbol fa-star',
                {
                  'fa-star-o': i >= ratings,
                  'fa-star': i <= ratings
                }
              )
            }
          />
        );
      })}
      <span className="count-review">({ratingInt})</span>
    </span>
  );
}

export default Rating;
