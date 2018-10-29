import React, {PureComponent} from 'react';
import RouterLink from 'react-router-dom/Link';

type Props = {
  auth: {
    user: {
      id: string,
      email: string,
      mobile: string,
      login_by: string,
    }
  },
}

class ViewAccount extends PureComponent<Props> {
  renderProfile = () => {
    const {auth: {user}} = this.props;
    const isEmailVisible = user.login_by === 'manual';

    return (
      <div className="account-section row no-margin">

        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
          <div className="account-section-header">
            <h3 className="account-section-title">Profile</h3>
          </div>
        </div>

        <div className="col-lg-9 col-md-9 col-sm-9 col-xs-12">
          <div className="account-section-content row no-margin">
            <div className="col-lg-7 col-md-7  no-pad">
              <div className="account-section-content-block">
                {isEmailVisible &&
                  <p className="account-section-text">
                    {user.email}
                  </p>
                }
                <p className="account-section-text">
                  Password <span>********</span>
                </p>
                <p className="account-section-text">
                  Phone: <span>{user.mobile || '-'}</span>
                </p>
              </div>
            </div>

            <div className="col-md-5 no-pad">
              <nav className="nav flex-column text-right">
                <RouterLink
                  to="/edit-account"
                  className="nav-link account-section-link"
                >
                  Edit Profile
                </RouterLink>
                <RouterLink
                  to="/change-password"
                  className="nav-link account-section-link"
                >
                  Change Password
                </RouterLink>
                <RouterLink
                  to="/delete-account"
                  className="nav-link account-section-link"
                >
                  Delete Account
                </RouterLink>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderDetails = () => {
    const {auth: {user}} = this.props;
    const userPlan = user.active_plan ? user.active_plan.title : '-';

    return (
      <div className="account-section row no-margin">
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
          <div className="account-section-header">
            <h3 className="account-section-title">Plan Details</h3>
          </div>
        </div>

        <div className="col-lg-9 col-md-9 col-sm-9 col-xs-12">
          <div className="account-section-content row no-margin">
            <div className="col-md-7 no-pad">
              <div className="account-section-content-block">
                <p className="account-section-text">
                  {userPlan}
                </p>
              </div>
            </div>

            <div className="col-md-5 no-pad">
              <nav className="nav flex-column text-right">
                <RouterLink
                  className="nav-link account-section-link"
                  to="/unsubscribe"
                >
                  Change Plan
                </RouterLink>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="content-row">
        <div className="content-cell bg-white align-middle">
          <div className="container-fluid">
            <div className="row content-wrapper content-profile">
              <div className="col-md-10 offset-md-1 account-layout">
                <div className="account-layout-inner">
                  <h1 className="title-profile text-center">My Account</h1>
                  <div className="account-content">
                    {this.renderProfile()}
                    {this.renderDetails()}
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

export default ViewAccount;
