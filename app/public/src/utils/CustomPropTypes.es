
import React from 'react';

const  Feature = React.PropTypes.shape({
  geometry: React.PropTypes.object,
  properties: React.PropTypes.object,
  type: React.PropTypes.oneOf(['Feature'])
});

const PlaceData = React.PropTypes.shape({
  boundary: Feature,
  data: React.PropTypes.shape({
    demands: React.PropTypes.object,
    supplies: React.PropTypes.object,
    needs: React.PropTypes.object,
    strategies: React.PropTypes.object
  })
});

export default {
  Feature,
  PlaceData
};