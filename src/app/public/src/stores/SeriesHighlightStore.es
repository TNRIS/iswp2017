
import alt from '../alt';
import SeriesHighlightActions from '../actions/SeriesHighlightActions';

class SeriesHighlightStore {
  constructor() {
    this.selectedSeries = null;
    this.bindListeners({
      handleSelect: SeriesHighlightActions.SELECT_SERIES,
      handleClear: SeriesHighlightActions.CLEAR_SERIES
    });
  }

  handleSelect(seriesName) {
    this.selectedSeries = seriesName;
  }

  handleClear() {
    this.selectedSeries = null;
  }
}

export default alt.createStore(SeriesHighlightStore, 'SeriesHighlightStore');