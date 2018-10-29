import React, {PureComponent} from 'react';

type Profile = {
  name: string,
  email: string,
  mobile: string,
}
type Props = {
  auth: {
    user: {
      name: string,
      email: string,
      mobile: string,
      login_by: string,
    }
  },
  accountUpdate: (Profile) => void,
}
type State = {
  ...Profile,
}

class EditAccount extends PureComponent<Props, State> {
  constructor(props) {
    super(props);

    const {auth: {user}} = props;

    this.state = {...user};
  }

  onProfileUpdate = (e) => {
    e.preventDefault();

    const {name, email, mobile} = this.state;

    this.props.accountUpdate({name, email, mobile});
  }

  handleInputChange = (e: any) => {
    const {value, name} = e.target;

    this.setState({[name]: value});
  }

  renderForm = () => {
    const {name, email, mobile} = this.state;
    const {auth: {user}} = this.props;
    const isManual = user.login_by === 'manual';

    return (
      <form>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="name"
            className="form-control"
            placeholder="Enter Your Name"
            required
            value={name}
            name="name"
            onChange={this.handleInputChange}
          />
        </div>

        {isManual &&
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
              required
              value={email}
              name="email"
              onChange={this.handleInputChange}
            />
          </div>
        }

        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Mobile Number"
            requiredmaxlength="11"
            value={mobile}
            name="mobile"
            onChange={this.handleInputChange}
          />
        </div>

        <div>
          <button
            type="submit"
            className="btn btn-mf-block"
            onClick={this.onProfileUpdate}
          >
            Save
          </button>
        </div>
      </form>
    );
  }

  render() {
    return (
      <div className="content-row">
        <div className="content-cell bg-white align-middle">
          <div className="container-fluid edit-account">
            <div className="row justify-content-center">
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="edit-account-container">
                  <h1 className="title-profile">Edit Account</h1>
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

export default EditAccount;
