/* @flow */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as SettingsActions from '../actions/settings';
import MagiciansPage from '../components/Pages/Magicians';
import {CircleSpinner} from '../components/Spinner';

type Props = {
  settings: {
    magicians: {
      name: string,
      address: string,
    }
  },
  getMagicians: () => void,
}

class MagiciansContainer extends Component<Props> {
  componentDidMount() {
    this.props.getMagicians();
  }

  render() {
    const {settings: {magicians}} = this.props;

    if (!magicians) {
      return (
        <div className="text-center loader__separator">
          <CircleSpinner/>
        </div>
      );
    }

    return (
      <MagiciansPage magicians={magicians}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(MagiciansContainer);
