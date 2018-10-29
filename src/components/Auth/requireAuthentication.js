// @flow

import React, {Component} from 'react';
import type {ComponentType, Element} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {forwardTo} from '../../utils';

type Props = {
  auth: {
    info: {
      isAuthenticated: boolean,
    }
  }
}

function requireAuthentication
  <C: ComponentType<Props>>(WrappingComponent: C): Element<C> {
  class AuthenticatedComponent extends Component<Props> {
    componentWillMount() {
      this.checkAuth();
    }

    checkAuth(props = null) {
      const {auth: {info: {isAuthenticated}}} = props || this.props;

      if (!isAuthenticated) {
        return forwardTo('/sing-in');
      }

      return true;
    }

    render() {
      const {auth: {info: {isAuthenticated}}} = this.props;

      return (
        <div className="layout_root">
          {isAuthenticated ?
            <WrappingComponent {...this.props}/> :
            <Redirect to="/sign-in"/>
          }
        </div>
      );
    }
  }

  const mapStateToProps = ({auth}) => ({auth});

  return connect(mapStateToProps, {})(AuthenticatedComponent);
}

export default requireAuthentication;
