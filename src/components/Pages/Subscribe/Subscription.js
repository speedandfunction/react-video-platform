import React, {Component, Fragment} from 'react';
import {Formik} from 'formik';
import classnames from 'classnames';
import scriptjs from 'scriptjs';

import {config} from '../config';
import {CircleSpinner} from '../../Spinner';

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
  auth: {
    loading: boolean,
    isPaymentStep: boolean,
    info: {
      promoCode: {
        type: {
          title: string,
        }
      },
    }
  },
  settings: {
    stripe_publishable_key: string,
  },
  sendMessage: (params: Object) => void,
  signUp: (params: AuthType) => void,
  hideSignUp: () => void,
  subscribe: (params: StripeType) => void,
}
type State = {
  isStripeLibLoaded: boolean,
  isStripeWinLoading: boolean,
  ...AuthType,
}

class Subscription extends Component<Props, State> {
  constructor() {
    super();

    const {
      auth: {login_by, device_type, device_token}
    } = config;

    this.state = {
      email: '',
      name: '',
      password: '',
      confirmPass: '',
      login_by,
      device_type,
      device_token,
      isStripeLibLoaded: false,
    };

    scriptjs(config.stripeURL, () => {
      this.setState({
        isStripeLibLoaded: true,
      });
    });
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.onClose, false);
    document.addEventListener('keydown', this.onEscape, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onClose, false);
    document.removeEventListener('keydown', this.onEscape, false);
  }

  onEscape = (e) => {
    if (e.keyCode === 27) {
      this.props.hideSignUp();
    }
  }

  onClose = (e: Event) => {
    // TODO: THINK HOW TO MOVE THIS SHIT OUT
    const isErrorMsg = e.target.closest('.uk-notify');

    if (this.node.contains(e.target) || isErrorMsg) {
      return;
    }

    this.props.hideSignUp();
  }

  onFormSubmit = (values: AuthType) => {
    const {password, confirmPass} = values;
    let isError = false;

    if (password !== confirmPass) {
      this.props.sendMessage({
        message: new Error('Passwords do not match!'),
        messageType: 'error',
      });
      isError = true;
    }

    if (!isError) {
      this.props.signUp(values);
    }
  }

  onStripeOpened = () => {
    this.setState({
      isStripeWinLoading: false,
    });
  }

  onPayPalChoose = () => {
    const {subscribe, auth: {info, user}} = this.props;

    subscribe({
      plan_id: 1,
      gateway: 'paypal',
      months: 1,
      id: user.id,
      token: info.token,
    });
  }

  onStripeChoose = () => {
    const {price} = config;
    const {
      subscribe,
      settings: {stripe_publishable_key},
      auth: {info, user},
    } = this.props;

    const description = !info.promoCode
      ? `Pay US$ ${price}$ per month`
      : info.promoCode.type.title;

    const handler = window.StripeCheckout.configure({
      key: stripe_publishable_key,
      locale: 'auto',
      token: ({id}) => {
        subscribe({
          plan_id: 1,
          gateway: 'stripe',
          months: 1,
          stripe_token: id,
          id: user.id,
          token: info.token,
        });
      }
    });

    this.setState(
      {isStripeWinLoading: true},
      () => {
        handler.open({
          email: user.email,
          name: '... Subscription',
          description,
          amount: !info.promoCode ? price * 100 : '',
          panelLabel: !info.promoCode ? 'Pay {{amount}} per month' : 'Confirm',
          opened: this.onStripeOpened,
        });
      }
    );
  }

  setModalNode = (node) => {
    this.node = node;
  }

  handleInputChange = (event: any) => {
    const {target: {value, name}} = event;

    this.setState({[name]: value});
  }

  renderCreditsButtons = () => {
    const {auth: {loading}} = this.props;
    const {isStripeWinLoading} = this.state;
    const isButtonsDisabled = isStripeWinLoading || loading;

    return (
      <div className="text-center">
        <button
          className={classnames(
            'btn btn-mf modal_type_stripe__submit',
            {disabled: isButtonsDisabled},
          )}
          onClick={this.onPayPalChoose}
        >
          <span>Paypal</span>
        </button>

        <button
          className={classnames(
            'btn btn-mf modal_type_stripe__submit',
            {disabled: isButtonsDisabled},
          )}
          onClick={this.onStripeChoose}
        >
          <span>Credit Card</span>
          {isStripeWinLoading && <CircleSpinner/>}
        </button>
      </div>
    );
  }

  renderForm = ({
    values,
    handleChange,
    handleSubmit,
  }) => {
    const {
      email, name, password, confirmPass,
      login_by, device_type, device_token,
    } = values;
    const {auth: {loading}} = this.props;

    return (
      <form method="post" onSubmit={handleSubmit}>
        <div className="input-group mf-input-group">
          <div className="input-group-prepend">
            <span className="input-group-text bg-white">
              <i className="fa fa-envelope" aria-hidden="true"/>
            </span>
          </div>
          <input
            type="email"
            name="email"
            className="form-control mf-form-control"
            placeholder="Your Email"
            autoComplete="on"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group mf-input-group">
          <div className="input-group-prepend">
            <span className="input-group-text bg-white">
              <i className="fa fa-user" aria-hidden="true"/>
            </span>
          </div>
          <input
            type="text"
            name="name"
            className="form-control mf-form-control"
            placeholder="Full Name"
            value={name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group mf-input-group">
          <div className="input-group-prepend">
            <span className="input-group-text bg-white">
              <i className="fa fa-key" aria-hidden="true"/>
            </span>
          </div>
          <input
            type="password"
            name="password"
            className="form-control mf-form-control"
            placeholder="Your password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group mf-input-group">
          <div className="input-group-prepend">
            <span className="input-group-text bg-white">
              <i className="fa fa-key" aria-hidden="true"/>
            </span>
          </div>
          <input
            type="password"
            name="confirmPass"
            className="form-control mf-form-control"
            placeholder="Confirm Your password"
            onChange={handleChange}
            required
            value={confirmPass}
          />
        </div>

        <input type="text" name="login_by" hidden defaultValue={login_by}/>
        <input type="text" name="device_type" hidden defaultValue={device_type}/>
        <input type="text" name="device_token" hidden defaultValue={device_token}/>

        <div className="text-center">
          <button
            type="submit"
            className={classnames(
              'btn btn-mf modal_type_sign-up__submit',
              {disabled: loading}
            )}
          >
            <span>SUBSCRIBE</span>
            {loading && <CircleSpinner/>}
          </button>
        </div>
      </form>
    );
  }

  render() {
    const {auth: {isPaymentStep, loading}} = this.props;
    const {
      isStripeLibLoaded,
      email, name, password, confirmPass,
      login_by, device_type, device_token,
    } = this.state;
    const title = loading ? 'Waiting for payment' : 'SUBSCRIPTION';

    return (
      <Fragment>
        <div className="modal_type_sign-in modal mf-modal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content" ref={this.setModalNode}>
              <div className="modal-body">
                <div className="row auth-tabs">
                  <div className="auth-tab col-12">
                    <a href="/#" className="active">{title}</a>
                  </div>
                </div>
                <div className="auth-body-tabs">
                  {!isStripeLibLoaded &&
                    <div className="text-center">
                      <CircleSpinner/>
                    </div>
                  }

                  {isStripeLibLoaded &&
                    <div className="login-form">
                      {!isPaymentStep &&
                        <Formik
                          initialValues={{
                            email,
                            name,
                            password,
                            confirmPass,
                            login_by,
                            device_type,
                            device_token,
                          }}
                          render={this.renderForm}
                          onSubmit={this.onFormSubmit}
                        />
                      }
                      {isPaymentStep && this.renderCreditsButtons()}
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show"/>
      </Fragment>
    );
  }
}

export default Subscription;
