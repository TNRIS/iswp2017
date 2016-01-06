
import React from 'react';

const ViewData = React.PropTypes.shape({
  demands: React.PropTypes.object,
  supplies: React.PropTypes.object,
  needs: React.PropTypes.object,
  strategies: React.PropTypes.object
});

const  Feature = React.PropTypes.shape({
  geometry: React.PropTypes.object,
  properties: React.PropTypes.object,
  type: React.PropTypes.oneOf(['Feature', 'FeatureCollection'])
});

const PlaceData = React.PropTypes.shape({
  boundary: Feature,
  data: ViewData
});

const EntityData = React.PropTypes.shape({
  entity: React.PropTypes.shape({
    EntityId: React.PropTypes.integer,
    EntityName: React.PropTypes.string,
    EntityTypeName: React.PropTypes.string,
    Latitude: React.PropTypes.float,
    Longitude: React.PropTypes.float,
    EntityIsSplit: React.PropTypes.string, //TODO: convert to bool?
  }),
  data: ViewData
});

const TreemapData = React.PropTypes.shape({
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.number,
  className: React.PropTypes.string,
  children: React.PropTypes.array //should be arrayOf(TreemapData) but that doesn't work
});

export default {
  Feature,
  ViewData,
  PlaceData,
  EntityData,
  TreemapData
};