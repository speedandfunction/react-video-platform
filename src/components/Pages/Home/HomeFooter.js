import React, {Component, Fragment} from 'react';

type Props = {
  settings: {
    instagram_link: string,
    facebook_link: string,
    twitter_link: string,
  }
}
type State = {
  spriteURL: string,
}

class HomeFooter extends Component<Props, State> {
  state = {
    spriteURL: '/public/img/svg/sprite.svg',
  }

  movePageTop = () => {
    window.scrollTo({top: 0});
  }

  renderSVGIcon = (name: string) => {
    const svgURL = `${this.state.spriteURL}#${name}`;

    return (
      <svg role="img" title="arrow" className="icon-50 icon-white">
        <use xlinkHref={svgURL}/>
      </svg>
    );
  }

  /* eslint camelcase: 0 */
  render() {
    const {
      settings: {
        instagram_link, facebook_link, twitter_link,
        site_download_block_title, site_footer_paragraph,
        site_quote_phrase, site_footer_logo,
      },
    } = this.props;

    return (
      <Fragment>
        <div className="home-footer">
          <div className="container-fluid footer-top">
            <div className="row align-items-center">
              <div className="col-lg-3 col-md-5 offset-md-1">
                <div className="footer-quote">
                  <svg role="img" title="arrow" className="icon-72 icon-white ">
                    <use xlinkHref={this.renderSVGIcon('quote')}/>
                  </svg>
                  <div className="footer-quote-txt">
                    Magic is believing in yourself,
                    if you can do that, you can make anything happen.
                  </div>
                  <div className="footer-quote-auth">
                    Johann Wolfgang von Goethe
                  </div>
                </div>
              </div>
              <div className="col-md-auto col-lg-4"/>
              <div className="col-lg-3 col-md-5">
                <div className="txt-border-app">
                  ... apps <br/> coming soon
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid footer-bottom">
            <div className="row">
              <div className="col-md-3 offset-md-1 order-md-1 order-3">
                <div className="logo-footer">
                  <a href="/#">
                    <img src="/public/img/logo.png" alt=""/>
                  </a>
                </div>
                <div className="logo-footer-descr">
                  {site_footer_paragraph}
                </div>
                <div className="social-btns social-footer">
                  <a href={facebook_link} className="facebook-color" target="_blank">
                    <span className="fa-stack">
                      <i className="circle-fa"/>
                      <i className="fab fa-facebook fa-stack-1x"/>
                    </span>
                  </a>
                  <a href={instagram_link} className="instagram-color">
                    <span className="fa-stack">
                      <i className="circle-fa"/>
                      <i className="fab fa-instagram fa-stack-1x"/>
                    </span>
                  </a>
                  <a href={twitter_link} className="twitter-color">
                    <span className="fa-stack">
                      <i className="circle-fa"/>
                      <i className="fab fa-twitter fa-stack-1x"/>
                    </span>
                  </a>
                </div>
              </div>
              <div className="col-md-4 order-md-2 order-1">
                <div className="devices-wr">
                  <img src={site_footer_logo} alt=""/>
                </div>
              </div>
              <div className="col-md-3 order-2 icons-app-footer">
                <svg role="img" title="arrow" className="icon-50 icon-white ">
                  <use xlinkHref={this.renderSVGIcon('arrow_download')}/>
                </svg>
                <img src="/public/img/app_download_icons.png" alt=""/>
              </div>
            </div>
          </div>
        </div>

        <button id="btnToTop" title="Up" onClick={this.movePageTop}>
          <i className="fa fa-angle-up" aria-hidden="true"/>
        </button>
      </Fragment>
    );
  }
}

export default HomeFooter;
