/* @flow */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as AuthActions from '../actions/auth';
import * as UserActions from '../actions/user';
import {
  ViewProfiles,
  ManageProfiles,
  EditProfile,
} from '../components/Pages/Profile';
import {CircleSpinner} from '../components/Spinner';
import Layout from '../layout';

type Props = {
  match: {
    path: string,
  },
  auth: {
    profile: [{
      id: string,
      picture: string,
      name: string,
    }]
  },
  getActiveProfile: () => void,
  getSubProfile: () => void,
  deleteProfile: () => void,
  updateProfile: ({data: Object}) => void,
}

class ProfileContainer extends Component<Props> {
  componentDidMount() {
    const {match: {path}} = this.props;

    /*
      For now we use only one account in the system.
      This request makes sense in future for multyprofiles system
    */
    if (/^\/profile\/.+\/edit/.test(path)) {
      this.props.getSubProfile();
    }
    this.props.getActiveProfile();
  }

  render() {
    const {
      auth,
      match,
      match: {path},
    } = this.props;
    let component = null;

    const {auth: {profile}} = this.props;

    if (!profile) {
      return (
        <Layout className="manage-profile__wrapper text-center">
          <CircleSpinner/>
        </Layout>
      );
    }

    switch (path) {
      case '/manage-profiles':
        component = <ManageProfiles auth={auth}/>;
        break;
      case '/view-profiles':
        component = <ViewProfiles auth={auth}/>;
        break;
      default:
        component = null;
    }

    if (/^\/profile\/.+\/edit/.test(path)) {
      component = (
        <EditProfile
          auth={auth}
          match={match}
          updateProfile={this.props.updateProfile}
          deleteProfile={this.props.deleteProfile}
        />
      );
    }

    return (
      <Layout className="manage-profile__wrapper">
        {component}
      </Layout>
    );
  }
}

const mapStateToProps = ({settings, auth}) => ({settings, auth});
const mapDispatchToProps = dispatch => (
  {
    dispatch,
    ...bindActionCreators({
      ...AuthActions,
      ...UserActions
    }, dispatch)
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
