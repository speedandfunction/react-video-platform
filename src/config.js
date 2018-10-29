export const defaultCategories = [
  {
    id: 1,
    method: 'get',
    alias: 'favorite',
    name: 'My Favorite',
    endpoint: 'public-api/videos/wishlist',
    sort: 'recent'
  },
  {
    id: 2,
    method: 'get',
    alias: 'popular',
    name: 'Most Popular',
    endpoint: 'public-api/videos',
    sort: 'watch',
  },
  {
    id: 3,
    method: 'get',
    alias: 'latest',
    name: 'New Releases',
    endpoint: 'public-api/videos',
    sort: 'recent',
  },
  {
    id: 4,
    method: 'get',
    alias: 'continue-watching',
    name: 'Continue  Watching',
    endpoint: 'public-api/videos/watching'
  }
];

export const tracker = {
  timeout: 5, // seconds
};

export const introConfig = {
  startDelay: 5, // seconds
};

export const sliderCommon = {
  fadeInTimeout: 350,
};

export const introSlider = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 5,
  arrows: false,
  adaptiveHeight: true,
  swipe: true,
  responsive: [
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
      }
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      }
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      }
    },
    {
      breakpoint: 479,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      }
    }
  ]
};

export const categorySlider = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 6,
  arrows: false,
  adaptiveHeight: true,
  swipe: true,
  responsive: [
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 6,
      }
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      }
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      }
    },
    {
      breakpoint: 479,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      }
    }
  ]
};
