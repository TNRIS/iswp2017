
import alt from '../alt';
import ViewChoiceActions from '../actions/ViewChoiceActions';
import constants from '../constants';

class ViewChoiceStore {
  constructor() {
    this.selectedDecade = constants.DECADES[0];
    this.selectedTheme = 'needs'; //default to Needs view

    this.bindListeners({
      handleUpdateDecadeChoice: ViewChoiceActions.UPDATE_DECADE_CHOICE,
      handleUpdateThemeChoice: ViewChoiceActions.UPDATE_THEME_CHOICE
    });
  }

  handleUpdateDecadeChoice(selectedDecade) {
    this.selectedDecade = selectedDecade;
  }

  handleUpdateThemeChoice(selectedTheme) {
    this.selectedTheme = selectedTheme;
  }
}

export default alt.createStore(ViewChoiceStore, 'ViewChoiceStore');