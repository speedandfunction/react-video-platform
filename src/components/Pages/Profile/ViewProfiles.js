import React, {Component} from 'react';
import RouterLink from 'react-router-dom/Link';

type Props = {
  auth: {
    profile: [{
      id: string,
      picture: string,
      name: string,
    }]
  },
}

class ViewProfiles extends Component<Props> {
  renderNewProfileBtn = () => {
    const {auth: {profile}} = this.props;

    if (!profile.length) {
      return (
        <li>
          <RouterLink to="/manage-profiles">
            <div className="addProfileIcon icon-tvuiAdd">
              <i className="fa fa-plus-circle"/>
            </div>
            <span className="profile-name">Add Profile</span>
          </RouterLink>
        </li>
      );
    }

    return null;
  }

  renderProfiles = () => {
    const {auth: {profile}} = this.props;

    return profile.map(profileItem => (
      <li className="profile">
        <RouterLink className="profile-link" to="/manage-profiles">
          <div className="avatar-wrapper">
            <div
              className="profile-icon"
              style={{backgroundImage: `url(${profileItem.picture})`}}
            />
          </div>
          <span className="profile-name">{profileItem.name}</span>
        </RouterLink>
      </li>
    ));
  }

  render() {
    return (
      <div className="content-row bg-white">
        <div className="container-fluid content-profile content-cell align-middle">
          <div className="row profiles-gate-container">
            <div className="col-md-10 offset-md-1">
              <div className="list-profiles">
                <h1 className="title-profile">
                  {"Who's watching?"}
                </h1>

                <ul className="choose-profile">
                  {this.renderProfiles()}
                  {this.renderNewProfileBtn()}
                </ul>

              </div>
              <RouterLink to="manage-profiles" className="btn btn-black">
                Done
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewProfiles;
