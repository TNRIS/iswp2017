
import alt from '../alt';
import ThemeDataActions from '../actions/ThemeDataActions';

class ThemeDataStore {
  constructor() {
    this.themeData = [];
    this.errorMessage = null;

    this.bindListeners({
      handleUpdateThemeData: ThemeDataActions.UPDATE_THEME_DATA,
      handleFetchThemeData: ThemeDataActions.FETCH_THEME_DATA,
      handleFetchThemeDataFailed: ThemeDataActions.FETCH_THEME_DATA_FAILED
    });
  }

  handleUpdateThemeData(themeData) {
    this.themeData = themeData;
  }

  handleFetchThemeData() {
    // reset to new empty object during fetch
    this.themeData = [];
    this.errorMessage = null;
  }

  handleFetchThemeDataFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

export default alt.createStore(ThemeDataStore, 'ThemeDataStore');