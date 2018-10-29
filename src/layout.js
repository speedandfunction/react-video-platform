import React from 'react';
import PropTypes from 'prop-types';

const Layout = ({className = '', children}) => {
  const cls = `${className}`;

  return (
    <div className={cls}>
      {children}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array
  ]).isRequired,
  className: PropTypes.string,
};

Layout.defaultProps = {
  className: '',
};

export default Layout;
