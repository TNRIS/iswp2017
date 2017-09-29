
import R from 'ramda';
import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Spinner from 'react-spinkit';
import classnames from 'classnames';

import constants from '../constants';
import PropTypes from '../utils/CustomPropTypes';
import ProjectSummarySubhead from './ProjectSummarySubhead';

export default createReactClass({
  displayName: 'ProjectSummary',

  propTypes: {
    projectData: PropTypes.ProjectDataSplit
  },

  mixins: [PureRenderMixin],

  render() {
    const props = this.props;

    if (!props.projectData || R.isEmpty(R.keys(props.projectData))) {
      return (
        <div className="view-summary">
          <Spinner name="double-bounce" fadeIn='none' />
        </div>
      );
    }

    const projectName = props.projectData.project.ProjectName;
    const isLong = projectName.length > constants.LONG_NAME_THRESHOLD;

    return (
      <div className="view-summary prj-summary">
        <h2 className={classnames({'long-name': isLong})}>
          {projectName}
        </h2>
        <div className="subhead">
          <ProjectSummarySubhead project={props.projectData.project} />
        </div>
      </div>
    );
  },
});