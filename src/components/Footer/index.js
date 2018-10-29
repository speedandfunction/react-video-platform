// @flow

import React from 'react';
import RouterLink from 'react-router-dom/Link';

/* Get footer links from 'allPages' request */
function Footer() {
  return (
    <footer className="footer">
      <div className="container-fluid footer-copyright">
        <div className="row align-items-center">
          <div className="col-lg-4 col-xl-3 offset-xl-1 order-1 left-menu-footer">
            <nav className="nav flex-column flex-lg-row justify-content-start">
              <RouterLink to="/founders" className="foot-link nav-link">
                About ...
              </RouterLink>
              <a href="/register" className="foot-link nav-link">Magicians Join</a>
              <a
                href="/"
                rel="noopener noreferrer"
                target="_blank"
                className="foot-link nav-link"
              >
                Blog
              </a>
            </nav>
          </div>
          <div className="col-lg-4 order-3 order-lg-2 copyright-wr">
            © 2018 - ... All rights reserved
          </div>
          <div className="col-lg-4 col-xl-3 order-2 order-lg-3 right-menu-footer">
            <nav className="nav flex-column flex-lg-row justify-content-end">
              <RouterLink className="foot-link nav-link" to="/static/others">
                Privacy
              </RouterLink>
              <RouterLink className="foot-link nav-link" to="/static/terms">
                Terms
              </RouterLink>
              <RouterLink className="foot-link nav-link" to="/static/help">
                FAQ
              </RouterLink>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
