/* flow */

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

class ManageProfiles extends Component<Props> {
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

  render() {
    const {auth: {profile}} = this.props;

    return (
      <div className="content-row bg-white">
        <div className="container-fluid content-profile content-cell align-middle">
          <div className="row profiles-gate-container ">
            <div className="col-md-10 offset-md-1">
              <div className="list-profiles">
                <h1 className="title-profile">Manage Profiles</h1>

                <ul className="choose-profile">
                  {profile.map((profileItem) => {
                    const editUrl = `/profile/${profileItem.id}/edit`;

                    return (
                      <li className="profile" key={profileItem.id}>
                        <RouterLink className="profile-link" to={editUrl}>
                          <div className="avatar-wrapper">
                            <div
                              className="profile-icon"
                              style={{backgroundImage: `url(${profileItem.picture})`}}
                            >
                              <div className="edit_sub_profile">
                                <i className="fa fa-pen-square"/>
                              </div>
                            </div>
                          </div>
                          <span className="profile-name">{profileItem.name}</span>
                        </RouterLink>
                      </li>
                    );
                  })}

                  {this.renderNewProfileBtn()}
                </ul>
              </div>
              <RouterLink to="/view-profiles" className="btn btn-black">Done</RouterLink>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ManageProfiles;
