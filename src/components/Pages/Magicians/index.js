import React, {Component} from 'react';
import RouterLink from 'react-router-dom/Link';

type Props = {
  magicians: {
    name: string,
    address: string,
  }
}

class MagiciansPage extends Component<Props> {
  renderWebLink = (magician) => {
    const {
      facebook_url, youtube_url, instagram_url, linkedin_url,
    } = magician;
    let {website} = magician;

    if (!magician.website) {
      website = facebook_url
        || youtube_url
        || instagram_url
        || linkedin_url
        || '';
    }

    return website.replace(/(^\w+:|^)\/\//, '');
  }

  renderMagician = (magician) => {
    const {
      id, first_name, name, token, address, picture, valid_video_count,
    } = magician;
    const webSite = this.renderWebLink(magician);
    const hideSiteName = webSite && webSite.length > 25;

    const imgThumb = picture.replace('images/', 'images/320x200/');

    return (
      <div className="magicians-page__item" key={magician.id}>
        <RouterLink className="grid-item-hover" to={`/magician/${id}`}/>
        <div className="mag-grid-thumb-wr">
          <div className="mag-grid-thumb" style={{backgroundImage: `url(${imgThumb})`}}/>
          <div className="mag-grid-info">
            <div className="row no-gutters align-items-center justify-content-between">
              <div className="col-12">
                <h4>{first_name} {name}</h4>
                <div className="from-country-mag">
                  {token}
                </div>
                <div className="row no-gutters align-items-center justify-content-between">
                  <div className="col-auto mag-grid-adress">
                    <i className="fa fa-map-marker-alt"/>
                    {address}
                  </div>
                  {!hideSiteName &&
                    <div className="col-auto mag-grid-url">
                      <i className="fa fa-link"/>
                      {webSite}
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="mag-grid-icons">
            <ul className="fa-ul">
              <li title="Videos">
                {valid_video_count}
                <i className="fa-li fa fa-file-video"/>
                <span className="invisible">0</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {magicians} = this.props;

    return (
      <div className="magicians-page">
        <div className="magicians-catalog">
          <div className="magicians-grid-wrapper" id="magicians-grid-wrapper">
            {magicians.data.map(this.renderMagician)}
          </div>
        </div>
      </div>
    );
  }
}

export default MagiciansPage;
