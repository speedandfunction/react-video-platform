// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Subscribe from '../components/Pages/Subscribe';
import Layout from '../layout';
import * as AuthActions from '../actions/auth';
import * as MessageActions from '../actions/messages';
import * as SettingsActions from '../actions/settings';
import Subscription from '../components/Pages/Subscribe/Subscription';
import {CircleSpinner} from '../components/Spinner';

type AuthType = {
  email: string,
  name: string,
  password: string,
  confirmPass: string,
  login_by: string,
  device_type: string,
  device_token: string,
}
type StripeType = {
  plan_id: number,
  gateway: string,
  months: number,
  stripe_token: string,
  id: string,
  token: string,
}
type Props = {
  match: {
    params: {
      coupon: string,
    },
  },
  auth: Object,
  settings: {
    cdn_url: string,
    stripe_publishable_key: string,
    homepage_video: {
      video: string,
      images: Object,
    },
    REACT_SITE_URL: string,
  },
  sendMessages: ({params: Object}) => void,
  sendCoupon: ({promoCode: string}) => void,
  signUp: ({params: AuthType}) => void,
  resetAuth: () => void,
  setPaymentState: ({isPaymentStep: boolean}) => void,
  subscribe: (params: StripeType) => void,
  getCoupon: ({coupon: string}) => void,
}
type State = {
  isSignUpVisible: boolean,
}

class SubscribeContainer extends Component<Props, State> {
  state = {
    isSignUpVisible: false,
  }

  componentDidMount() {
    const {
      getCoupon,
      match: {params: {coupon}}
    } = this.props;

    if (coupon) {
      getCoupon({coupon});
    }
  }

  isSettingsLoaded = () => Boolean(this.props.settings.REACT_SITE_URL);

  _showSignUp = () => this.setState({isSignUpVisible: true});

  _hideSignUp = () => this.setState({isSignUpVisible: false});

  _sendMessages = params => this.props.sendMessages(params);

  _signUp = params => this.props.signUp(params);

  _resetAuth = () => this.props.resetAuth();

  _subscribe = params => this.props.subscribe(params);

  _showPaymentStep = () => {
    this.setState({isSignUpVisible: true}, () => {
      this.props.setPaymentState({
        isPaymentStep: true,
      });
    });
  }

  render() {
    const {
      auth, settings, sendCoupon,
      match: {params: {coupon}},
    } = this.props;
    const {isSignUpVisible} = this.state;

    if (coupon && auth.loading) {
      return (
        <div className="text-center loader__separator">
          <CircleSpinner/>
        </div>
      );
    }

    return (
      <Layout className="basic-landing subscription-page">
        <Subscribe
          auth={auth}
          sendCoupon={sendCoupon}
          showSignUp={this._showSignUp}
          resetAuth={this._resetAuth}
          showPaymentStep={this._showPaymentStep}
        />
        {isSignUpVisible &&
          <Subscription
            auth={auth}
            settings={settings}
            signUp={this._signUp}
            sendMessage={this._sendMessages}
            hideSignUp={this._hideSignUp}
            subscribe={this._subscribe}
            showPaymentStep={this._showPaymentStep}
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
    ...bindActionCreators({
      ...AuthActions,
      ...MessageActions,
      ...SettingsActions,
    }, dispatch)
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(SubscribeContainer);
