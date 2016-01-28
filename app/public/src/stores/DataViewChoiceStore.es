
import alt from '../alt';
import DataViewChoiceActions from '../actions/DataViewChoiceActions';
import constants from '../constants';

class DataViewChoiceStore {
  constructor() {
    this.selectedDecade = constants.DECADES[0];
    this.selectedTheme = 'needs'; //default to Needs view

    this.bindListeners({
      handleUpdateDecadeChoice: DataViewChoiceActions.UPDATE_DECADE_CHOICE,
      handleUpdateThemeChoice: DataViewChoiceActions.UPDATE_THEME_CHOICE
    });
  }

  handleUpdateDecadeChoice(selectedDecade) {
    this.selectedDecade = selectedDecade;
  }

  handleUpdateThemeChoice(selectedTheme) {
    this.selectedTheme = selectedTheme;
  }
}

export default alt.createStore(DataViewChoiceStore, 'DataViewChoiceStore');