import React from 'react';
import {Link} from 'react-router';

export default React.createClass({
  render() {
    return (
      <div className="not-found">
        <div className="container">
          <div className="row data-section-row">
            <div className="twelve columns">
              <h3>Not Found</h3>
              <p>The page you requested does not exist.</p>
              <p>Try <Link to="placeview" params={{type: 'region', typeId: 'K'}}>this one</Link> instead.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

});