
import PlaceDataActions from '../actions/PlaceDataActions';
import PlaceDataFetcher from '../utils/PlaceDataFetcher';

export default {
  fetch: {
    remote(state, {type, typeId}) {
      console.log('in remote', state);
      return PlaceDataFetcher.fetch({type: type, typeId: typeId});
      //axios.get(``).then((reponse) => response.data);
    },

    // local(state) {
    //   //TODO: check if state is already exists
    // }

    success: PlaceDataActions.updatePlaceData,
    error: PlaceDataActions.fetchPlaceDataFailed
  }
};