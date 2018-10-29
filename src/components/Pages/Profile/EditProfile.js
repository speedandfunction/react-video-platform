import React, {PureComponent} from 'react';
import RouterLink from 'react-router-dom/Link';

type Props = {
  match: {
    params: {
      uid: string,
    },
  },
  auth: {
    profile: [{
      id: string,
      picture: string,
      name: string,
    }]
  },
  deleteProfile: () => void,
  updateProfile: ({data: Object}) => void,
}
type State = {
  profile: {
    id: string,
    picture: string,
    name: string,
  },
}

class EditProfile extends PureComponent<Props, State> {
  constructor(props) {
    super(props);

    const profile = this.getProfile();

    this.state = {profile};
  }

  onSave = (e) => {
    e.preventDefault();

    const {profile: {name}} = this.state;
    const {auth: {user: {token, id, sub_profile_id}}} = this.props;
    const {current: {files}} = this.fileUpload;

    this.props.updateProfile({
      picture: files[0],
      name,
      token,
      id,
      sub_profile_id,
    });
  }

  onDelete = (e) => {
    e.preventDefault();

    if (window.confirm('Are you sure?')) {
      this.props.deleteProfile();
    }
  }

  onFielsUpdate = (event) => {
    const {target: {name, value}} = event;

    this.setState({
      profile: {
        ...this.state.profile,
        [name]: value,
      }
    });
  }

  onImageUpload = (e) => {
    e.preventDefault();

    const reader = new FileReader();
    const {current: {files}} = this.fileUpload;

    reader.onload = () => {
      this.setState({
        profile: {
          ...this.state.profile,
          picture: reader.result,
        },
      });
    };
    reader.readAsDataURL(files[0]);
  }

  getProfile = () => {
    const {
      auth: {profile},
      match: {params: {uid}}
    } = this.props;
    const uidInt = parseInt(uid, 10);

    if (!profile) {
      return false;
    }

    return profile.find(item => (
      item.id === uidInt ? item : false
    ));
  }

  fileUpload: {current: null | HTMLDivElement}

  fileUpload = React.createRef();

  renderButtons = () => (
    <div className="profile__actions">
      <button className="btn btn-black" onClick={this.onSave}>Save</button>
      <RouterLink className="btn btn-gray" to="/manage-profiles">Cancel</RouterLink>
      <button className="btn btn-danger" onClick={this.onDelete}>Delete Profile</button>
    </div>
  )

  render() {
    const {profile: {picture, name}} = this.state;

    return (
      <div className="content-row bg-white">
        <div className="container-fluid content-profile content-cell align-middle">
          <div className="row profiles-gate-container">
            <div className="col-md-10 offset-md-1">
              <div className="profile-actions-container">
                <h1 className="title-profile">Edit Profile</h1>

                <form method="post">
                  <div className="profile-metadata profile-entry">
                    <div className="main-profile-avatar">
                      <img src={picture} alt={name}/>
                      <div className="image_sub_profile">
                        <i className="fa fa-plus-circle"/>
                      </div>
                      <input
                        ref={this.fileUpload}
                        type="file"
                        name="picture"
                        className="hidden profile__upload-field"
                        accept="image/png, image/jpeg"
                        onChange={this.onImageUpload}
                      />
                    </div>
                    <div className="profile-add-parent">
                      <div className="profile-entry-inputs">
                        <input
                          className="form-control"
                          placeholder="Name"
                          type="text"
                          required
                          value={name}
                          name="name"
                          onChange={this.onFielsUpdate}
                        />
                        <label htmlFor="add-profile-name" aria-label="Name"/>
                      </div>
                    </div>
                  </div>

                  {this.renderButtons()}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditProfile;
