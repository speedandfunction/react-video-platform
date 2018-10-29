// @flow

/* Test coupon - 'mymagic | Vanel' */

import React, {Fragment, Component} from 'react';
import RouterLink from 'react-router-dom/Link';
import classnames from 'classnames';

import {config} from '../config';
import {checkAuth} from '../../../utils/auth';

type Props = {
  auth: {
    info: {
      promoCode: {
        type: {
          kind: string,
          value: string,
          title: string,
        },
      },
      token: string,
      isAuthenticated: boolean,
    },
  },
  sendCoupon: ({promoCode: string}) => void,
  showSignUp: () => void,
  resetAuth: () => void,
  showPaymentStep: () => void,
}
type State = {
  hasCoupon: boolean,
  promoCodeIsValid: boolean,
  newPrice: ?number,
  price: number,
  sign_up_status: string,
  promoCode: string,
}

class Subscribe extends Component<Props, State> {
  constructor(props: Props) {
    super();

    const {auth: {info: {promoCode}}} = props;

    this.state = {
      hasCoupon: false,
      price: config.price,
      newPrice: null,
      promoCodeIsValid: Boolean(promoCode),
      sign_up_status: checkAuth(),
      promoCode: '',
    };
  }

  onSignUpShow = (e: any) => {
    e.preventDefault();

    this.props.showSignUp();
  }

  onCheckCoupon = () => {
    const {promoCode} = this.state;

    this.props.sendCoupon({promoCode});
  }

  onSubscriptionReset = () => {
    this.props.resetAuth();
  }

  onSubscriptionContinue = (e: Event) => {
    e.preventDefault();

    this.props.showPaymentStep();
  }

  getNewPrice = () => {
    const {
      auth: {
        info: {
          promoCode: {type: {kind, value}}
        }
      }
    } = this.props;
    const {price} = this.state;
    let newPrice;

    if (kind === 'percent') {
      newPrice = Math.round(price - (price * (parseFloat(value) / 100)));

      const first = Math.round(newPrice);
      const last = Math.round((newPrice * 100) % 100);

      newPrice = `${first}.${last === 0 ? '00' : last}`;
    }

    return newPrice;
  }

  handleInputChange = (e: any) => {
    const {value, name} = e.target;

    this.setState({[name]: value});
  }

  promoHandler = (e: any) => {
    const {checked, name} = e.target;

    this.setState({
      [name]: checked,
      promoCodeIsValid: false,
    });
  }

  isCurrentPriceVisible = () => {
    const {auth: {info: {promoCode}}} = this.props;

    return !promoCode;
  };

  isCongratulationsVisible = () => {
    const {hasCoupon, promoCodeIsValid, newPrice} = this.state;

    return hasCoupon && promoCodeIsValid && newPrice === '0.00';
  }

  isConfirmVisible = () => {
    const {hasCoupon, promoCodeIsValid} = this.state;

    return !promoCodeIsValid && hasCoupon;
  }

  isPromoVisible = () => {
    const {auth: {info: {promoCode, token, isAuthenticated}}} = this.props;

    return !promoCode && !(token && !isAuthenticated);
  }

  renderControlls = () => {
    const {
      hasCoupon,
      sign_up_status,
    } = this.state;
    const {auth: {info: {promoCode, token, isAuthenticated}}} = this.props;
    const isLinkDisabled = !((promoCode && hasCoupon) || !hasCoupon);
    const isContinueVisible = token && !isAuthenticated;
    const isSubscribeVisible = !isContinueVisible && !sign_up_status;

    return (
      <Fragment>
        {isContinueVisible &&
          <Fragment>
            <RouterLink
              to="/#"
              className={classnames({
                disabled: isLinkDisabled
              })}
              onClick={this.onSubscriptionContinue}
            >
                Continue subscribe
            </RouterLink>
            <button
              className="btn btn-restart-subscr"
              onClick={this.onSubscriptionReset}
            >
              Restart your subscription
            </button>
          </Fragment>
        }

        {isSubscribeVisible &&
          <RouterLink
            to="/#"
            className={classnames({
              disabled: isLinkDisabled
            })}
            onClick={this.onSignUpShow}
          >
            Subscribe
          </RouterLink>
        }
      </Fragment>
    );
  }

  renderForm = () => (
    <Fragment>
      {this.isPromoVisible() &&
        <div className="subscription-coupon pb-1">
          <div className="form-check">
            <label className="form-check-label" htmlFor="hasCoupon">
              <input
                className="form-check-input position-static"
                type="checkbox"
                id="hasCoupon"
                name="hasCoupon"
                checked={this.state.hasCoupon}
                onChange={this.promoHandler}
              />
              <span>Have a Promo Code?</span>
            </label>
          </div>
          <div className="form-group w-75 w-md-75 mx-auto">
            <input
              type="text"
              className={classnames(
                'form-control subscription-coupon-field mt-1 mb-3',
                {disabled: !this.state.hasCoupon}
              )}
              name="promoCode"
              placeholder="Promo Code"
              onChange={this.handleInputChange}
            />
          </div>
          {this.isConfirmVisible() &&
            <button
              className="btn-mf btn-confirm"
              onClick={this.onCheckCoupon}
            >
              Confirm
            </button>
          }
        </div>
      }
      {this.renderControlls()}
    </Fragment>
  )

  render() {
    const {auth: {info: {promoCode}}} = this.props;
    const {price} = this.state;
    let newPrice;

    if (promoCode) {
      newPrice = this.getNewPrice();
    }

    return (
      <div className="landing-image bg-img">
        <div className="subscription content">
          <div className="container-fluid subscription-content">
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <div className="subscription-pro">
                  <div className="subscr-block">
                    {promoCode && newPrice === '0.00' &&
                      <div className="subscr-block-price free">
                        Congratulations!<br/>
                        Enjoy Free Subscription First Month
                      </div>
                    }
                    {promoCode && newPrice !== '0.00' &&
                      <div className="subscr-block-price free">
                        US <s>${price}</s> ${newPrice} per month
                      </div>
                    }
                    {this.isCurrentPriceVisible() &&
                      <div className="subscr-block-price">
                        US ${price} per month
                      </div>
                    }

                    <div className="subscr-block-descr">
                      <ul>
                        <li>
                          <i className="fa fa-check"/>
                          Unlimited Watch Time
                        </li>
                        <li>
                          <i className="fa fa-check"/>
                          Unlimited Tutorials
                        </li>
                        <li>
                          <i className="fa fa-check"/>
                          Unlimited Performances & TV Shows
                        </li>
                        <li>
                          <i className="fa fa-check"/>
                          Play from PC and Mobile
                        </li>
                      </ul>
                      {this.renderForm()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Subscribe;
