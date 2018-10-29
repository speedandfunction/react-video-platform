import React, {Component} from 'react';
import classnames from 'classnames';
import AnimateHeight from 'react-animate-height';
import RouterLink from 'react-router-dom/Link';

import {MenuLinks} from './config';

type Props = {
  settings: {
    categories: Object,
  },
  pathname: string,
  hideSidebar: () => void,
}
type State = {
  styles: Object,
  sidebarMenuItems: Object,
}

class Sidebar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = this.generateState();

    /* Hack for slide effect */
    setTimeout(() => {
      this.setState({
        styles: {width: '100%'},
      });
    }, 0);
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.onSidebarHide, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onSidebarHide, false);
  }

  onSidebarHide = (e: Event) => {
    const isBurger = Boolean(e.target.closest('.sidebar__switcher'));
    const isPlusIcon = Boolean(e.target.closest('.toggle-menu-icon'));

    if (isPlusIcon || isBurger) {
      return;
    }

    setTimeout(this.props.hideSidebar, 200);
  }

  onSubMenuShow = (id: string) => {
    const {sidebarMenuItems} = this.state;
    const currentStatus = sidebarMenuItems[`isSubMenu${id}`];

    this.setState({
      sidebarMenuItems: {
        ...sidebarMenuItems,
        [`isSubMenu${id}`]: !currentStatus ? 'auto' : 0,
      }
    });
  }

  getCategoryData = (category: {name: string}) => (
    MenuLinks.find(item => (
      category.name === item.text
    ))
  )

  generateState = () => {
    const {settings: {categories}} = this.props;
    let sidebarMenuItems = [];

    if (categories) {
      sidebarMenuItems = categories.reduce((items, category) => (
        {...items, [`isSubMenu${category.id}`]: 0}
      ), {});
    }

    return {
      styles: {},
      sidebarMenuItems,
    };
  }

  sidebarRef: {current: null | HTMLDivElement}

  sidebarRef = React.createRef();

  renderCategories = (categories: [{id: string, name: string}]) => {
    if (!categories) {
      return null;
    }

    return categories.map((category) => {
      const {pathname} = this.props;
      const url = pathname.substr(1);
      const {link} = this.getCategoryData(category);
      const isActive = url === link;

      return (
        <li key={category.id} className={classnames({'active-link': isActive})}>
          <RouterLink to={`/${link}`}>
            {category.name}
          </RouterLink>
          <span
            className="toggle-menu-icon"
            onClick={() => this.onSubMenuShow(category.id)}
          >
            <i className="fa fa-plus"/>
          </span>

          <AnimateHeight
            duration={500}
            height={this.state.sidebarMenuItems[`isSubMenu${category.id}`]}
          >
            <div className="right-menu-sub-list">
              {this.renderSubCategories(category)}
            </div>
          </AnimateHeight>
        </li>
      );
    });
  }

  renderSubCategories = ({subcategories, predefined}) => {
    if (!subcategories) {
      return null;
    }

    const items = [].concat(predefined, subcategories);

    return items.map(({id, name, videos}) => {
      if (!videos || !videos.length) {
        return false;
      }

      return (
        <div key={id}>
          <RouterLink to={`/category/${id}`}>{name}</RouterLink>
        </div>
      );
    });
  }

  render() {
    const {settings: {categories}} = this.props;

    return (
      <div
        ref={this.sidebarRef}
        className="menu-overlay"
        style={this.state.styles}
      >
        <ul className="right-menu-list" id="ulRightMenu">
          {categories && this.renderCategories(categories)}
          <li>
            <RouterLink to="/magicians">Magicians</RouterLink>
          </li>
          <li>
            <a
              href="https://blog....net"
              target="_blank"
              rel="noopener noreferrer"
            >
              Blog
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default Sidebar;
