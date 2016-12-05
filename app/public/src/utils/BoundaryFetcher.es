
import CdbUtil from './CdbUtil';

export default {
  /**
  *
  * @param {String} type the type of boundary to fetch ('region' or 'county')
  * @param {String} id the id of the boundary (like a region letter or county name)
  *
  */
  fetch: ({type, typeId}) => {
    if (type === 'region') {
      return CdbUtil.getRegion(typeId);
    }
    else if (type === 'county') {
      return CdbUtil.getCounty(typeId);
    }
    else if (type === 'source') {
      return CdbUtil.getSource([typeId]);
    }

    throw new Error('Invalid type specified in BoundaryFetcher');
  }
};
