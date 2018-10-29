import React, {PureComponent} from 'react';

type PasswordType = {
  password: '',
}
type Props = {
  deleteAccount: (PasswordType) => void,
  clearSettingsMedia: () => void,
}
type State = {
  ...PasswordType
}

class DeleteAccount extends PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
    };
  }

  onProfileDelete = (e) => {
    e.preventDefault();

    const {password} = this.state;

    this.props.deleteAccount({password});
    this.props.clearSettingsMedia();
  }

  handleInputChange = (e: any) => {
    const {value, name} = e.target;

    this.setState({[name]: value});
  }

  renderForm = () => (
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
          placeholder="Enter Password"
          value={this.state.password}
          required
          name="password"
          onChange={this.handleInputChange}
        />
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="btn btn-mf-block"
          onClick={this.onProfileDelete}
        >
          Delete
        </button>
      </div>
    </form>
  )

  render() {
    return (
      <div className="content-row">
        <div className="content-cell bg-white">
          <div className="container-fluid content-profile">
            <div className="row">
              <div className="col-md-12">
                <h1 className="text-center">Delete Account</h1>
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

export default DeleteAccount;
