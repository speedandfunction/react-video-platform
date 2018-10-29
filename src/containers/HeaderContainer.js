/* @flow */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as AuthActions from '../actions/auth';
import * as SearchActions from '../actions/search';
import * as SettingsActions from '../actions/settings';
import Header from '../components/Header';

type Props = {
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
  location: Object,
  searchVideos: ({value: string}) => void,
  clearSearch: () => void,
  getCategories: () => void,
  logout: () => void,
  clearSettingsMedia: () => void,
}

class HeaderContainer extends Component<Props> {
  constructor(props) {
    super(props);

    console.log('DRAW HEADER');
  }

  render() {
    const {
      auth, location, settings, search,
    } = this.props;

    return (
      <Header
        auth={auth}
        location={location}
        settings={settings}
        search={search}
        searchVideos={this.props.searchVideos}
        clearSearch={this.props.clearSearch}
        getCategories={this.props.getCategories}
        logout={this.props.logout}
        clearSettingsMedia={this.props.clearSettingsMedia}
      />
    );
  }
}

const mapStateToProps = ({auth, search, settings}) => ({auth, search, settings});
const mapDispatchToProps = dispatch => (
  {
    dispatch,
    ...bindActionCreators({
      ...AuthActions,
      ...SearchActions,
      ...SettingsActions,
    }, dispatch)
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
