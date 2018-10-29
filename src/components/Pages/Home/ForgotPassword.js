import React, {Component, Fragment} from 'react';
import classnames from 'classnames';

import {CircleSpinner} from '../../Spinner';

type AuthType = {
  email: string,
}
type Props = {
  auth: {
    loading: boolean,
  },
  hideForgotPassword: () => void,
  resetPassword: (AuthType) => void,
}
type State = {
  ...AuthType,
}

class ForgotPassword extends Component<Props, State> {
  state = {
    email: '',
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
      this.props.hideForgotPassword();
    }
  }

  onClose = (e: Event) => {
    // TODO: THINK HOW TO MOVE THIS SHIT OUT
    const isErrorMsg = e.target.closest('.uk-notify');

    if (this.node.contains(e.target) || isErrorMsg) {
      return;
    }

    this.props.hideForgotPassword();
  }

  onResetPassword = (e: any) => {
    e.preventDefault();

    const {email} = this.state;

    this.props.resetPassword({email});
  }

  setModalNode = (node) => {
    this.node = node;
  }

  handleInputChange = (e: any) => {
    const {target: {value, name}} = e;

    this.setState({[name]: value});
  }

  render() {
    const {email} = this.state;
    const {auth: {loading}} = this.props;

    return (
      <Fragment>
        <div className="modal_type_sign-in modal mf-modal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content" ref={this.setModalNode}>
              <div className="modal-body">
                <div className="row auth-tabs">
                  <div className="auth-tab col-12">
                    <a href="/#" className="active">FORGOT PASSWORD</a>
                  </div>
                </div>
                <div className="auth-body-tabs">
                  <div className="login-form">
                    <form method="post" name="signUpForm">
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
                          required
                          value={email}
                          onChange={this.handleInputChange}
                        />
                      </div>

                      <div className="text-center">
                        <button
                          type="submit"
                          className={classnames(
                            'btn btn-mf modal_type_sign-in__submit',
                            {disabled: loading}
                          )}
                          onClick={this.onResetPassword}
                        >
                          <span>SUBMIT</span>
                          {loading && <CircleSpinner/>}
                        </button>
                      </div>

                      <div className="form-txt-block text-center">
                        <p className="form-txt">Password reset email will be sent to you shortly</p>
                      </div>
                    </form>
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

export default ForgotPassword;
