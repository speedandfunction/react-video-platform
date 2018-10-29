/* @flow */

import React, {Component} from 'react';
import RouterLink from 'react-router-dom/Link';
import classnames from 'classnames';

import {MenuLinks} from './config';
import Search from './Search';
import Dropdown from './Dropdown';
import Sidebar from './Sidebar';

type Props = {
  location: {
    pathname: string,
  },
  auth: {
    info: {
      isAuthenticated: boolean,
    },
    user: {
      picture: string,
    }
  },
  search: {
    videos: Object,
  },
  settings: {
    cdn_url: string,
    categories: Object,
    isMobile: boolean,
  },
  searchVideos: ({value: string}) => void,
  clearSearch: () => void,
  getCategories: () => void,
  logout: () => void,
  clearSettingsMedia: () => void,
}
type State = {
  isSidebarVisible: boolean,
}

class Header extends Component<Props, State> {
  state = {
    isSidebarVisible: false,
  }

  componentDidMount() {
    const {auth: {info: {isAuthenticated}}} = this.props;

    if (isAuthenticated && !localStorage.subscriptionInProgress) {
      this.props.getCategories();
    }

    delete localStorage.subscriptionInProgress;
  }

  componentWillUpdate(prevProps: Props) {
    const {
      settings, auth: {info},
      getCategories,
    } = this.props;

    /* If user logging in */
    if (!settings.categories) {
      if (
        prevProps.auth.info.isAuthenticated
          && !info.isAuthenticated
      ) {
        if (!localStorage.subscriptionInProgress) {
          getCategories();
        }

        delete localStorage.subscriptionInProgress;
      }
    }
  }

  onSidebarToogle = () => {
    const {isSidebarVisible} = this.state;

    this.setState({
      isSidebarVisible: !isSidebarVisible,
    });
  }

  getHeaderClass = () => {
    const {location: {pathname}} = this.props;
    const isStaticPage = /^\/static\/.+/.test(pathname);
    return isStaticPage
      ? 'header bg-header-white header_type_unlogged'
      : 'landing-header header over header_type_unlogged';
  }

  _hideSidebar = () => {
    this.setState({isSidebarVisible: false});
  }

  isInActiveCategory = (categoryId: string, text: string) => {
    const {
      settings: {categories},
    } = this.props;
    let isInCategory = false;

    categories.forEach((category) => {
      const items = [].concat(category.subcategories, category.predefined);

      items.forEach((subcategory) => {
        if (subcategory.id === categoryId) {
          if (category.name === text) {
            isInCategory = true;
          }
        }
      });
    });

    return isInCategory;
  }

  renderHeaderLinks = () => (
    <ul className="nav justify-content-center">
      {MenuLinks.map(({text, link, disabled}) => {
        const url = `/${link}`;
        const {
          location: {pathname},
          settings: {categories},
        } = this.props;
        let isActiveLink = pathname === url;

        /* Exception for MAGICIAN page */
        if (link === 'magicians' && /\/magician\//.test(pathname)) {
          isActiveLink = true;
        }

        /* If we're in videos category */
        if (categories && /\/category\//.test(pathname)) {
          const categoryId = /\/category\/(.+)/.exec(pathname)[1];

          isActiveLink = this.isInActiveCategory(categoryId, text);
        }

        /* If we're in video page */
        if (categories && /-video\//.test(pathname)) {
          const categoryId = /-video\/(.+)\/([0-9]+)/.exec(pathname)[1];

          isActiveLink = this.isInActiveCategory(categoryId, text);
        }

        return (
          <li
            className={classnames(
              'nav-item',
              {
                'active-link': isActiveLink,
                disabled,
              }
            )}
            key={link}
          >
            <RouterLink className="nav-link" to={url}>
              {text}
            </RouterLink>
          </li>
        );
      })}
    </ul>
  )

  renderLoggedInHeader = () => {
    const {
      auth,
      settings,
      location: {pathname},
      logout,
      clearSettingsMedia,
    } = this.props;
    const {isMobile} = settings;
    const {isSidebarVisible} = this.state;
    const showSidebar = isSidebarVisible && settings.categories;
    let cls = 'header bg-header-black';

    /* F..ng logic for old f...ng HTML :( */
    if (
      /^\/magic-tutorials/.test(pathname) ||
      /-video\//.test(pathname) ||
      /^\/magic-performances/.test(pathname)
    ) {
      cls = `${cls} over`;
    }

    return (
      <header className={cls}>
        <div className="container-fluid">
          <div className="row align-items-center justify-content-between basic-header">
            <div className="col-8 col-md-3 col-sm-12 order-lg-1 logo">
              <RouterLink to="/">
                <img src="/public/img/logo.png" alt="..."/>
              </RouterLink>
            </div>

            {!isMobile &&
              <div className="col order-lg-2 order-md-2 nav-primary-header">
                {this.renderHeaderLinks()}
              </div>
            }

            <div className="col-4 col-sm-12 col-md-9 col-lg-3 order-lg-2 order-md-3">
              <div className="row align-items-center justify-content-end authorized-header">
                {!isMobile &&
                  <div className="col col-10 col-md-auto">
                    <Search {...this.props}/>
                    <Dropdown auth={auth} logout={logout} clearSettingsMedia={clearSettingsMedia}/>
                  </div>
                }

                <div className="col col-12 col-md-3 col-md-auto text-right">
                  <button
                    type="button"
                    className={classnames(
                      'btn hamburger hamburger--3dx js-hamburger sidebar__switcher',
                      {'is-active': isSidebarVisible}
                    )}
                    onClick={this.onSidebarToogle}
                  >
                    <div className="hamburger-box">
                      <div className="hamburger-inner"/>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {showSidebar &&
            <Sidebar
              settings={settings}
              hideSidebar={this._hideSidebar}
              pathname={pathname}
            />
          }
        </div>
      </header>
    );
  }

  renderUnloggedHeader = () => (
    <header className={this.getHeaderClass()}>
      <div className="container-fluid">
        <div className="row align-items-center justify-content-between basic-header">
          <div className="col-8 col-md-3 col-sm-12 order-lg-1 logo">
            <RouterLink to="/">
              <img src="/public/img/logo.png" alt="..."/>
            </RouterLink>
          </div>
        </div>
      </div>
    </header>
  )

  render() {
    const {auth: {info: {isAuthenticated}}} = this.props;

    if (!isAuthenticated) {
      return this.renderUnloggedHeader();
    }

    return this.renderLoggedInHeader();
  }
}

export default Header;
