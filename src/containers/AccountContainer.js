/* @flow */

import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as AuthActions from '../actions/auth';
import * as UserActions from '../actions/user';
import * as SettingsActions from '../actions/settings';
import {
  ViewAccount, EditAccount,
  ChangePassword, DeleteAccount,
  Unsubscribe,
} from '../components/Pages/Account';
import Layout from '../layout';

type Profile = {
  name: string,
  email: string,
  mobile: string,
}
type PasswordType = {
  password: '',
  newPassword: '',
  confirmPassword: '',
}
type Props = {
  auth: {
    user: {
      email: string,
      mobile: string,
    }
  },
  match: {
    params: {
      uid: string,
    },
    path: string,
  },
  accountUpdate: (Profile) => void,
  passwordUpdate: (PasswordType) => void,
  deleteAccount: ({password: string}) => void,
  clearSettingsMedia: () => void,
  unsubscribe: () => void,
}

class AccountContainer extends PureComponent<Props> {
  render() {
    const {
      auth,
      match: {path},
      accountUpdate, passwordUpdate,
      deleteAccount, clearSettingsMedia,
      unsubscribe,
    } = this.props;
    let component = null;

    switch (path) {
      case '/edit-account':
        component = (
          <EditAccount auth={auth} accountUpdate={accountUpdate}/>
        );
        break;
      case '/change-password':
        component = (
          <ChangePassword auth={auth} passwordUpdate={passwordUpdate}/>
        );
        break;
      case '/delete-account':
        component = (
          <DeleteAccount
            auth={auth}
            deleteAccount={deleteAccount}
            clearSettingsMedia={clearSettingsMedia}
          />
        );
        break;
      case '/unsubscribe':
        component = (
          <Unsubscribe auth={auth} unsubscribe={unsubscribe}/>
        );
        break;
      default:
        component = <ViewAccount auth={auth}/>;
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
      ...UserActions,
      ...SettingsActions,
    }, dispatch)
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(AccountContainer);
