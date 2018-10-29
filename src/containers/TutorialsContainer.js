/* @flow */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as SettingsActions from '../actions/settings';
import * as MediaActions from '../actions/media';
import * as UserActions from '../actions/user';
import Tutorials from '../components/Pages/Tutorials';
import {CircleSpinner} from '../components/Spinner';

type Props = {
  settings: {
    intros: {
      data: [Object],
    },
  },
  media: {
    tutorialsIntro: string,
    currentIntro: {
      magician: {
        id: string,
      },
      id: string,
      images: Object,
    },
  },
  getIntros: () => void,
  loadTutorialsIntro: ({id: string}) => void,
  clearTutorialsIntro: () => void,
  loadCardVideo: ({id: string}) => void,
  clearCardVideo: () => void,
  loadMagicianTutorials: ({id: string}) => void,
  setCurrentIntro: ({video: Object}) => void,
  clearMagicianVideos: () => void,
  loadCategoryVideos: (category: Object) => void,
  addToWishList: ({id: string}) => void,
  removeFromWishList: ({id: string}) => void,
  track: ({hash: string, time: number}) => void,
}

class TutorialsContainer extends Component<Props> {
  constructor(props) {
    super(props);

    props.getIntros();
  }

  render() {
    const {
      settings, media,
      loadCardVideo, clearCardVideo, loadMagicianTutorials,
      setCurrentIntro, clearTutorialsIntro, loadTutorialsIntro,
      clearMagicianVideos, loadCategoryVideos,
      addToWishList, removeFromWishList, track,
    } = this.props;

    if (!settings.intros || !media.currentIntro) {
      return (
        <div className="content magic-tutorials magic-tutorials_type_loading text-center">
          <CircleSpinner/>
        </div>
      );
    }

    return (
      <Tutorials
        settings={settings}
        media={media}
        loadTutorialsIntro={loadTutorialsIntro}
        clearTutorialsIntro={clearTutorialsIntro}
        loadCardVideo={loadCardVideo}
        clearCardVideo={clearCardVideo}
        loadMagicianTutorials={loadMagicianTutorials}
        setCurrentIntro={setCurrentIntro}
        clearMagicianVideos={clearMagicianVideos}
        loadCategoryVideos={loadCategoryVideos}
        addToWishList={addToWishList}
        removeFromWishList={removeFromWishList}
        track={track}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(TutorialsContainer);
