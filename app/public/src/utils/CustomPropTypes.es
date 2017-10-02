
import PropTypes from 'prop-types';

import constants from '../constants';

const ViewData = PropTypes.shape({
  demands: PropTypes.object,
  supplies: PropTypes.object,
  needs: PropTypes.object,
  strategies: PropTypes.object
});

const SrcViewData = PropTypes.shape({
  supplies: PropTypes.object,
  strategies: PropTypes.object
});

const PrjViewData = PropTypes.shape({
  strategies: PropTypes.object
});

const  Feature = PropTypes.shape({
  geometry: PropTypes.object,
  properties: PropTypes.object,
  type: PropTypes.oneOf(['Feature', 'FeatureCollection'])
});

const PlaceData = PropTypes.shape({
  boundary: Feature,
  data: ViewData
});

const SourceData = PropTypes.shape({
  boundary: Feature,
  data: SrcViewData
});

const ProjectDataSplit = PropTypes.shape({
  data: PrjViewData,
  project: PropTypes.object
});

const EntityData = PropTypes.shape({
  entity: PropTypes.shape({
    EntityId: PropTypes.integer,
    EntityName: PropTypes.string,
    EntityTypeName: PropTypes.string,
    Latitude: PropTypes.float,
    Longitude: PropTypes.float,
    EntityIsSplit: PropTypes.string, //TODO: convert to bool?
  }),
  data: ViewData
});

const TreemapData = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.array //should be arrayOf(TreemapData) but that doesn't work
});

const ProjectData = PropTypes.arrayOf(PropTypes.shape({
  CapitalCost: PropTypes.number.isRequired,
  OnlineDecade: PropTypes.oneOf(constants.DECADES).isRequired,
  ProjectName: PropTypes.string.isRequired,
  ProjectSponsors: PropTypes.string.isRequired,
  WMSProjectId: PropTypes.number.isRequired,
  WMSProjectSponsorRegion: PropTypes.oneOf(constants.REGIONS).isRequired
}));

export default {
  ViewData,
  SrcViewData,
  Feature,
  PlaceData,
  SourceData,
  ProjectDataSplit,
  EntityData,
  TreemapData,
  ProjectData
};
