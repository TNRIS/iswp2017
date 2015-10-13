
import React from 'react';

export default {
  PlaceData: React.PropTypes.shape({
    boundary: React.PropTypes.shape({
      geometry: React.PropTypes.object,
      properties: React.PropTypes.object,
      type: React.PropTypes.string
    }),
    data: React.PropTypes.shape({
      demands: React.PropTypes.object,
      supplies: React.PropTypes.object,
      needs: React.PropTypes.object,
      strategies: React.PropTypes.object
    })
  }),


};