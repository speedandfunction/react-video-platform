// @flow

import React from 'react';

function DottedSpinner() {
  return (
    <div className="page-loading ng-hide">
      <div className="spinner">
        <div className="bounce1"/>
        <div className="bounce2"/>
        <div className="bounce3"/>
      </div>
    </div>
  );
}

export default DottedSpinner;
