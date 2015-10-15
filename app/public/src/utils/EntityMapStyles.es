
import R from 'ramda';

const defaults = R.flip(R.merge);

const styleDefault = {
  radius: 4,
  opacity: 1,
  fillOpacity: 0.9
};

const styles = {
  demands: {
    color: '#1FC684'
  },
  supplies: {
    color: '#FBB50D'
  },
  needs: {
    color: '#AA0000'
  },
  strategies: {
    color: '#FF7518'
  }
};

export default function(theme) {
  return defaults(styles[theme] || {}, styleDefault);
}