
import alt from '../alt';
import DecadeChoiceActions from '../actions/DecadeChoiceActions';
import constants from '../constants';

class DecadeChoiceStore {
  constructor() {
    this.selectedDecade = constants.DECADES[0];

    this.bindListeners({
      handleUpdateDecadeChoice: DecadeChoiceActions.UPDATE_DECADE_CHOICE
    });
  }

  handleUpdateDecadeChoice(selectedDecade) {
    this.selectedDecade = selectedDecade;
  }
}

export default alt.createStore(DecadeChoiceStore, 'DecadeChoiceStore');