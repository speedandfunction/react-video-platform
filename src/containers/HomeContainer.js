// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {forwardTo} from '../utils';
import Layout from '../layout';
import Home from '../components/Pages/Home';
import HomeFooter from '../components/Pages/Home/HomeFooter';
import SignIn from '../components/Pages/Home/SignIn';
import ForgotPassword from '../components/Pages/Home/ForgotPassword';
import {CircleSpinner} from '../components/Spinner';
import * as AuthActions from '../actions/auth';

type AuthType = {
  email: string,
  password: string,
  remember: boolean,
  login_by: string,
  device_type: string,
  device_token: string,
}
type Props = {
  auth: {
    info: {
      isAuthenticated: boolean,
    },
  },
  settings: {
    cdn_url: string,
    homepage_video: {
      video: string,
      images: Object,
    },
    REACT_SITE_URL: string,
    site_home_trailer_title: string,
    site_title: string,
    site_subtitle: string,
  },
  login: (AuthType) => void,
  resetPassword: ({email: string}) => void,
}
type State = {
  isSignInVisible: boolean,
  isForgotPasswordVisible: boolean,
}

class HomeContainer extends Component<Props, State> {
  static defaultProps = {
    settings: {
      homepage_video: {
        video: '',
        images: {},
      },
    },
  };

  state = {
    isSignInVisible: false,
    isForgotPasswordVisible: false,
  }

  componentDidMount() {
    const {auth: {info: {isAuthenticated}}} = this.props;

    if (isAuthenticated) {
      forwardTo('/magic-tutorials');
    }
  }

  getThumbURL = () => {
    const {
      settings: {cdn_url, homepage_video: {images}}
    } = this.props;

    return `${cdn_url}/images/${images['1']}`;
  }

  isSettingsLoaded = () => Boolean(this.props.settings.REACT_SITE_URL);

  _showSignIn = () => this.setState({isSignInVisible: true});

  _hideSignIn = () => this.setState({isSignInVisible: false});

  _showForgotPass = () => this.setState({isForgotPasswordVisible: true});

  _hideForgotPassword = () => this.setState({isForgotPasswordVisible: false});

  _login = (params: AuthType) => {
    this.props.login(params);
  }

  render() {
    const {settings} = this.props;
    const {isSignInVisible, isForgotPasswordVisible} = this.state;

    return (
      <Layout className="basic-landing">
        <Home
          settings={settings}
          getThumbURL={this.getThumbURL}
          isSettingsLoaded={this.isSettingsLoaded}
          showSignIn={this._showSignIn}
        />
        <HomeFooter
          settings={settings}
        />
        {isSignInVisible &&
          <SignIn
            auth={this.props.auth}
            login={this._login}
            hideSignIn={this._hideSignIn}
            showForgotPass={this._showForgotPass}
          />
        }
        {isForgotPasswordVisible &&
          <ForgotPassword
            auth={this.props.auth}
            hideForgotPassword={this._hideForgotPassword}
            resetPassword={this.props.resetPassword}
          />
        }
      </Layout>
    );
  }
}

const mapStateToProps = ({auth, settings}) => ({auth, settings});
const mapDispatchToProps = dispatch => (
  {
    dispatch,
    ...bindActionCreators(AuthActions, dispatch)
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
