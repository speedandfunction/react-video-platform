// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Redirect} from 'react-router-dom';

import * as SettingsActions from '../actions/settings';
import {CircleSpinner} from '../components/Spinner';

type StaticPage = {
  heading: string,
  description: string,
  type: string,
}
type Props = {
  settings: {
    staticData: [StaticPage],
  },
  match: {
    params: {
      id: string,
    }
  },
  getStaticPage: () => void;
}

class StaticContainer extends Component<Props> {
  componentDidMount() {
    this.props.getStaticPage();
  }

  getStaticPage = () => {
    const {match: {params: {id}}} = this.props;
    const {settings: {staticData}} = this.props;

    return staticData.find(page => page.type === id);
  }

  renderLoader = () => (
    <div className="container-fluid static-page">
      <div className="row">
        <div className="col-md-10 offset-md-1 text-center">
          <CircleSpinner/>
        </div>
      </div>
    </div>
  );

  render() {
    const {settings: {staticData}} = this.props;

    if (!staticData) {
      return this.renderLoader();
    }

    const page = this.getStaticPage();

    if (!page) {
      return <Redirect to="/"/>;
    }

    return (
      <div className="container-fluid static-page">
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <h1 className="login-tit">{page.heading}</h1>
            <p dangerouslySetInnerHTML={{__html: page.description}}/>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({settings}) => ({settings});

const mapDispatchToProps = dispatch => (
  {
    dispatch,
    ...bindActionCreators({
      ...SettingsActions,
    }, dispatch)
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(StaticContainer);
