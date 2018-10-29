// @flow

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as MessagesActions from '../actions/messages';
import Message from '../components/Message';

type Props = {
  messages: {
    message: Object,
    messageType: string,
  },
  clearMessages: () => void,
}

class MessagesContainer extends Component<Props> {
  _clearMessages = () => {
    this.props.clearMessages();
  }

  render() {
    const {messages: {message, messageType}} = this.props;

    return (
      <Message
        clearMessages={this._clearMessages}
        message={message}
        messageType={messageType}
      />
    );
  }
}

const mapStateToProps = ({messages}) => ({messages});

const mapDispatchToProps = dispatch => (
  {
    dispatch,
    ...bindActionCreators({
      ...MessagesActions,
    }, dispatch)
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(MessagesContainer);
