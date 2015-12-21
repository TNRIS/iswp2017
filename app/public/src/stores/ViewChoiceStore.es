
import alt from '../alt';
import ViewChoiceActions from '../actions/ViewChoiceActions';
import constants from '../constants';

class ViewChoiceStore {
  constructor() {
    this.selectedDecade = constants.DECADES[0];

    this.bindListeners({
      handleUpdateDecadeChoice: ViewChoiceActions.UPDATE_DECADE_CHOICE
    });
  }

  handleUpdateDecadeChoice(selectedDecade) {
    this.selectedDecade = selectedDecade;
  }
}

export default alt.createStore(ViewChoiceStore, 'ViewChoiceStore');