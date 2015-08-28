import alt from '../alt';
import ThemeDataFetcher from '../utils/ThemeDataFetcher';

class ThemeDataActions {
  updateThemeData(themeData) {
    this.dispatch(themeData);
  }

  fetchThemeData(options) {
    this.dispatch();
    ThemeDataFetcher.fetch(options)
      .then((themeData) => {
        this.actions.updateThemeData(themeData);
      })
      .catch((error) => {
        this.actions.fetchThemeDataFailed(error);
      });
  }

  fetchThemeDataFailed(error) {
    // TODO: Better error message generation
    this.dispatch(error.toString());
  }
}

export default alt.createActions(ThemeDataActions);