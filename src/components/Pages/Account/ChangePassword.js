import React, {PureComponent} from 'react';

type PasswordType = {
  password: '',
  newPassword: '',
  confirmPassword: '',
}
type Props = {
  passwordUpdate: (PasswordType) => void,
}
type State = {
  ...PasswordType
}

class ChangePassword extends PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      newPassword: '',
      confirmPassword: '',
    };
  }

  onProfileUpdate = (e) => {
    e.preventDefault();

    const {
      password, newPassword, confirmPassword,
    } = this.state;

    this.props.passwordUpdate({
      password, newPassword, confirmPassword
    });
  }

  handleInputChange = (e: any) => {
    const {value, name} = e.target;

    this.setState({[name]: value});
  }

  renderForm = () => {
    const {password, newPassword, confirmPassword} = this.state;

    return (
      <form>
        <div className="input-group mf-input-group">
          <div className="input-group-prepend">
            <span className="input-group-text bg-white">
              <i className="fa fa-key" aria-hidden="true"/>
            </span>
          </div>
          <input
            type="password"
            className="form-control mf-form-control"
            placeholder="Old Password"
            value={password}
            required
            name="password"
            onChange={this.handleInputChange}
          />
        </div>
        <div className="input-group mf-input-group">
          <div className="input-group-prepend">
            <span className="input-group-text bg-white">
              <i className="fa fa-key" aria-hidden="true"/>
            </span>
          </div>
          <input
            type="password"
            className="form-control mf-form-control"
            placeholder="New Password"
            value={newPassword}
            required
            name="newPassword"
            onChange={this.handleInputChange}
          />
        </div>
        <div className="input-group mf-input-group">
          <div className="input-group-prepend">
            <span className="input-group-text bg-white">
              <i className="fa fa-key" aria-hidden="true"/>
            </span>
          </div>
          <input
            type="password"
            className="form-control mf-form-control"
            placeholder="Confirm Password"
            value={confirmPassword}
            required
            name="confirmPassword"
            onChange={this.handleInputChange}
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="btn btn-mf-block"
            onClick={this.onProfileUpdate}
          >
            Change
          </button>
        </div>
      </form>
    );
  }

  render() {
    return (
      <div className="content-row">
        <div className="content-cell bg-white align-middle">
          <div className="container-fluid content-profile">
            <div className="row">
              <div className="col-md-12">
                <h1 className="text-center title-profile">Change Password</h1>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="login-form">
                  {this.renderForm()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChangePassword;
