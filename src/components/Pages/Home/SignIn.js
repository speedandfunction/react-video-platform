import React, {Component, Fragment} from 'react';
import {Formik} from 'formik';
import classnames from 'classnames';

import {config} from '../config';
import {CircleSpinner} from '../../Spinner';

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
    loading: boolean,
  },
  showForgotPass: () => void,
  hideSignIn: () => void,
  login: (AuthType) => void,
}
type State = {
  ...AuthType,
}

class SignIn extends Component<Props, State> {
  constructor() {
    super();

    const {
      auth: {
        login_by, device_type, device_token,
      }
    } = config;

    this.state = {
      email: '',
      password: '',
      remember: true,
      login_by,
      device_type,
      device_token,
    };
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
      this.props.hideSignIn();
    }
  }

  onClose = (e: Event) => {
    // TODO: THINK HOW TO MOVE THIS SHIT OUT
    const isErrorMsg = e.target.closest('.uk-notify');

    if (this.node.contains(e.target) || isErrorMsg) {
      return;
    }

    this.props.hideSignIn();
  }

  onForgotPassShow = (e) => {
    e.preventDefault();

    this.props.hideSignIn();
    this.props.showForgotPass();
  }

  onFormSubmit = (values) => {
    this.props.login({...values});
  }

  setModalNode = (node) => {
    this.node = node;
  }

  handleInputChange = (event: any) => {
    const {
      target: {
        type, checked, value, name
      },
    } = event;

    this.setState({
      [name]: type === 'checkbox' ? checked : value
    });
  }

  renderForm = ({
    values,
    handleChange,
    handleSubmit,
  }) => {
    const {
      email, password, remember,
      login_by, device_type, device_token,
    } = values;
    const {auth: {loading}} = this.props;

    return (
      <form method="post" name="signUpForm" onSubmit={handleSubmit}>
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
            required
            onChange={handleChange}
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
            className="form-control mf-form-control"
            placeholder="Password"
            required
            autoComplete="on"
            value={password}
            name="password"
            onChange={handleChange}
          />
        </div>

        <div className="input-group mf-input-group">
          <label className="input-group-prepend">
            <input
              type="checkbox"
              checked={remember}
              name="remember"
              onChange={handleChange}
            />
            <span className="remember-me">Remember me</span>
          </label>
        </div>

        <input type="text" defaultValue={login_by} name="login_by" hidden/>
        <input type="text" defaultValue={device_type} name="device_type" hidden/>
        <input type="text" defaultValue={device_token} name="device_token" hidden/>

        <div className="text-center">
          <button
            type="submit"
            className={classnames(
              'btn btn-mf modal_type_sign-in__submit',
              {disabled: loading}
            )}
          >
            <span>SIGN IN</span>
            {loading && <CircleSpinner/>}
          </button>
        </div>

        <div className="text-center">
          <a onClick={this.onForgotPassShow} href="/forgot-password" className="text-black">
            Forgot password
          </a>
        </div>
      </form>
    );
  }

  render() {
    const {
      email, password, remember,
      login_by, device_type, device_token,
    } = this.state;

    return (
      <Fragment>
        <div className="modal_type_sign-in modal mf-modal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content" ref={this.setModalNode}>
              <div className="modal-body">
                <div className="row auth-tabs">
                  <div className="auth-tab col-12">
                    <a href="/#" className="active">SIGN IN</a>
                  </div>
                </div>
                <div className="auth-body-tabs">
                  <div className="login-form">
                    <Formik
                      initialValues={{
                        email,
                        password,
                        remember,
                        login_by,
                        device_type,
                        device_token,
                      }}
                      render={this.renderForm}
                      onSubmit={this.onFormSubmit}
                    />
                  </div>
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

export default SignIn;
