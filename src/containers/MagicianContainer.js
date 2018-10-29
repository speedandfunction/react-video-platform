/* @flow */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as SettingsActions from '../actions/settings';
import * as MediaActions from '../actions/media';
import * as UserActions from '../actions/user';

import Layout from '../layout';
import MagicianPage from '../components/Pages/Magician';
import {CircleSpinner} from '../components/Spinner';

type Props = {
  match: {
    params: {
      mid: string,
    },
  },
  media: {
    magicianCategoriesVideos: {
      tutotials: [Object],
      perfomances: [Object],
    }
  },
  settings: {
    magicians: {
      data: [{
        id: string,
        name: string,
        address: string,
      }]
    }
  },
  getMagicians: () => void,
  getIntros: () => void,
  getMagicianVideos: ({mid: string}) => void,
  loadCardVideo: (id: string) => void,
  clearCardVideo: () => void,
  track: ({hash: string, time: number}) => void,
  loadTutorialsIntro: ({id: string}) => void,
}

class MagicianContainer extends Component<Props> {
  componentDidMount() {
    const {match: {params: {mid}}} = this.props;

    this.props.getIntros();
    this.props.getMagicianVideos({mid});
    this.props.getMagicians();
  }

  getCurrentMagician = () => {
    const {
      match: {params: {mid}},
      settings: {magicians},
    } = this.props;
    const intMid = parseInt(mid, 10);

    if (!magicians) {
      return null;
    }

    return magicians.data.find((magician) => {
      if (magician.id === intMid) {
        return magician;
      }
      return false;
    });
  }

  render() {
    const magician = this.getCurrentMagician();
    const {media, settings} = this.props;

    if (!magician) {
      return (
        <Layout className="magician-wrapper">
          <div className="content-row bg-gray-light">
            <div className="content-cell">
              <div className="text-center loader__separator">
                <CircleSpinner/>
              </div>
            </div>
          </div>
        </Layout>
      );
    }

    return (
      <Layout className="magician-wrapper">
        <MagicianPage
          media={media}
          settings={settings}
          magician={magician}
          loadCardVideo={this.props.loadCardVideo}
          clearCardVideo={this.props.clearCardVideo}
          loadTutorialsIntro={this.props.loadTutorialsIntro}
          track={this.props.track}
        />
      </Layout>
    );
  }
}

const mapStateToProps = ({settings, media}) => ({settings, media});
const mapDispatchToProps = dispatch => (
  {
    dispatch,
    ...bindActionCreators({
      ...SettingsActions,
      ...MediaActions,
      ...UserActions,
    }, dispatch)
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(MagicianContainer);
