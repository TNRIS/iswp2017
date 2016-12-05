
import React from 'react';

import constants from '../constants';

const ViewData = React.PropTypes.shape({
  demands: React.PropTypes.object,
  supplies: React.PropTypes.object,
  needs: React.PropTypes.object,
  strategies: React.PropTypes.object
});

const SrcViewData = React.PropTypes.shape({
  supplies: React.PropTypes.object,
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

const SourceData = React.PropTypes.shape({
  boundary: Feature,
  data: SrcViewData
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

const ProjectData = React.PropTypes.arrayOf(React.PropTypes.shape({
  CapitalCost: React.PropTypes.number.isRequired,
  OnlineDecade: React.PropTypes.oneOf(constants.DECADES).isRequired,
  ProjectName: React.PropTypes.string.isRequired,
  ProjectSponsors: React.PropTypes.string.isRequired,
  WMSProjectId: React.PropTypes.number.isRequired,
  WMSProjectSponsorRegion: React.PropTypes.oneOf(constants.REGIONS).isRequired
}));

export default {
  ViewData,
  SrcViewData,
  Feature,
  PlaceData,
  SourceData,
  EntityData,
  TreemapData,
  ProjectData
};