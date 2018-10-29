// @flow

import React, {Fragment, Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {persistStore} from 'redux-persist';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classnames from 'classnames';

import requireAuthentication from '../components/Auth/requireAuthentication';
import {store} from '../store';
import * as SettingsActions from '../actions/settings';
import {
  MessagesContainer, StaticContainer,
  HomeContainer, SubscribeContainer,
  HeaderContainer, TutorialsContainer,
  CategoryContainer, VideoContainer,
  MagiciansContainer, MagicianContainer,
  ProfileContainer, AccountContainer,
  PerformancesContainer,
} from './index';
import Footer from '../components/Footer';
import FoundersPage from '../components/Pages/Founders';

type Props = {
  auth: {
    info: {
      isAuthenticated: boolean,
    },
  },
  getSettings: () => void,
  setSettings: ({isMobile: boolean}) => void,
}
type State = {
  isMobile: boolean,
  rehydrated: boolean,
}

class App extends Component<Props, State> {
  state = {
    isMobile: false,
    rehydrated: false,
  };

  componentWillMount() {
    persistStore(store, {whitelist: ['auth']}, () => {
      this.setState({rehydrated: true});
    });
  }

  render() {
    const {rehydrated} = this.state;

    if (!rehydrated) {
      return <div/>;
    }

    return (
      <Fragment>
        <MessagesContainer/>
        <div
          className={classnames('main-wrapper-in', {
            mobile: this.state.isMobile
          })}
        >
          <HeaderContainer {...this.props}/>
          <Switch>
            <Route exact from="/" component={HomeContainer}/>
            <Route from="/subscribe/:coupon" component={SubscribeContainer}/>
            <Route from="/subscribe" component={SubscribeContainer}/>
            <Route from="/founders" component={FoundersPage}/>
            <Route from="/static/:id" component={StaticContainer}/>

            <Route exact path="/magic-tutorials" component={requireAuthentication(TutorialsContainer)}/>
            <Route exact path="/magicians" component={requireAuthentication(MagiciansContainer)}/>
            <Route exact path="/magician/:mid" component={requireAuthentication(MagicianContainer)}/>
            <Route exact path="/category/:cid" component={requireAuthentication(CategoryContainer)}/>
            <Route exact path="/tutorial-video/:cid/:vid" component={requireAuthentication(VideoContainer)}/>
            <Route exact path="/performance-video/:cid/:vid" component={requireAuthentication(VideoContainer)}/>

            <Route exact path="/magic-performances" component={requireAuthentication(PerformancesContainer)}/>

            <Route exact path="/manage-profiles" component={requireAuthentication(ProfileContainer)}/>
            <Route exact path="/view-profiles" component={requireAuthentication(ProfileContainer)}/>
            <Route exact path="/profile/:uid/edit" component={requireAuthentication(ProfileContainer)}/>

            <Route exact path="/account-settings" component={requireAuthentication(AccountContainer)}/>
            <Route exact path="/edit-account" component={requireAuthentication(AccountContainer)}/>
            <Route exact path="/change-password" component={requireAuthentication(AccountContainer)}/>
            <Route exact path="/delete-account" component={requireAuthentication(AccountContainer)}/>
            <Route exact path="/unsubscribe" component={requireAuthentication(AccountContainer)}/>

            <Redirect from="*" to="/"/>
          </Switch>
          <Footer/>
        </div>
      </Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => (
  {
    dispatch,
    ...bindActionCreators({
      ...SettingsActions,
    }, dispatch)
  }
);

export default connect(null, mapDispatchToProps)(App);
