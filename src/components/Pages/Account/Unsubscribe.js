import React, {PureComponent} from 'react';
import classnames from 'classnames';

import {CircleSpinner} from '../../Spinner';

type Props = {
  auth: {
    loading: boolean,
  },
  unsubscribe: () => void,
}

class Unsubscribe extends PureComponent<Props> {
  onUnsubscribe = (e) => {
    e.preventDefault();

    this.props.unsubscribe();
  }

  render() {
    const {auth: {loading}} = this.props;

    return (
      <div className="content-row">
        <div className="content-cell align-middle bg-white">
          <div className="container-fluid content-profile">
            <div className="row">
              <div className="col-md-12">
                <h1 className="title-profile">Unsubscribe</h1>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="login-form">
                  <form method="post">
                    <label className="text-black">
                      By clicking Unsubscribe you agree with ... Terms of
                      Service. Your subscription and so the access to content is
                      available till last day of your paid plan
                    </label>
                    <div className="text-center">
                      <button
                        type="submit"
                        className={classnames(
                          'btn btn-mf-block modal_type_sign-in__submit',
                          {disabled: loading}
                        )}
                        onClick={this.onUnsubscribe}
                      >
                        <span>Unsubscribe</span>
                        {loading && <CircleSpinner/>}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Unsubscribe;
