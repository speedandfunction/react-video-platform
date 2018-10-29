import React, {PureComponent} from 'react';

type Props = {
  message: Object,
  messageType: string,
  clearMessages: () => void,
}
type State = {
  isVisible: boolean,
}

const VISIBILITY_TIMEOUT = 3000;

class Message extends PureComponent<Props, State> {
  state = {
    isVisible: false,
    timerInstance: null,
  }

  componentWillReceiveProps(nextProps) {
    this.clearTimer();

    if (nextProps.message) {
      this.setState({isVisible: true}, () => {
        this.setTimer();
      });
    }
  }

  onClose = () => {
    this.clearTimer();
    this.setState({isVisible: false});
    this.props.clearMessages();
  }

  setTimer = () => {
    const timer = setTimeout(() => this.onClose(), VISIBILITY_TIMEOUT);

    this.setState({timerInstance: timer});
  }

  clearTimer = () => {
    const {timerInstance} = this.state;

    if (timerInstance) {
      clearTimeout(timerInstance);
    }
  }

  render() {
    const {message, messageType} = this.props;
    const {isVisible} = this.state;

    if (isVisible) {
      const msgTypeClass = messageType === 'error' ? 'danger' : 'success';
      const msgClass = `uk-notify-message uk-notify-message-${msgTypeClass}`;
      const msgTxt = messageType === 'error'
        ? (message.message || 'Unknown Error')
        : message;

      return (
        <div
          className="uk-notify uk-notify-top-center"
          onClick={this.onClose}
        >
          <div className={msgClass}>
            <div>{msgTxt}</div>
          </div>
        </div>
      );
    }

    return '';
  }
}

export default Message;
