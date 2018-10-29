/* flow */

import React, {Component} from 'react';
import RouterLink from 'react-router-dom/Link';

type Props = {
  auth: {
    user: {
      picture: string,
    }
  },
  logout: () => void,
  clearSettingsMedia: () => void,
}
type State = {
  isDropdownOpen: boolean,
}

class Dropdown extends Component<Props, State> {
  state = {
    isDropdownOpen: false,
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.onDropdownHide, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onDropdownHide, false);
  }

  onDropdownHide = (e: Event) => {
    const {current} = this.dropdownList;
    const isAvatar = e.target.closest('.avatar-container');

    if (current && (current.contains(e.target) || isAvatar)) {
      return;
    }

    this.setState({isDropdownOpen: false});
  }

  onDropdownOpen = () => {
    const {isDropdownOpen} = this.state;

    this.setState({
      isDropdownOpen: !isDropdownOpen,
    });
  }

  onLogout = (e) => {
    e.preventDefault();

    this.props.logout();
    this.props.clearSettingsMedia();
  }

  dropdownList = React.createRef();

  render() {
    const {auth: {user: {picture}}} = this.props;
    const {isDropdownOpen} = this.state;

    return (
      <div className="dropdown dropdown-ava">
        <button
          className="btn btn-secondary avatar-container"
          type="button"
          style={{backgroundImage: `url(${picture})`}}
          onClick={this.onDropdownOpen}
        />

        {isDropdownOpen &&
          <div
            className="header__dropdown-menu dropdown-menu text-center show"
            ref={this.dropdownList}
          >
            <RouterLink to="/manage-profiles" className="dropdown-item">
              Manage profile
            </RouterLink>
            <RouterLink to="/account-settings" className="dropdown-item">
              Your Account
            </RouterLink>
            <RouterLink to="/logout" className="dropdown-item" onClick={this.onLogout}>
              Signout
            </RouterLink>
          </div>
        }
      </div>
    );
  }
}

export default Dropdown;
