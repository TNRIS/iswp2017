
import R from 'ramda';

const defaults = R.flip(R.merge);

const styleDefault = {
  radius: 4,
  opacity: 1,
  fillOpacity: 0.9
};

const styles = {
  demands: {
    color: '#ff00ff'
  },
  needs: {
    color: '#00ff00'
  }
};

export default function(theme) {
  return defaults(styles[theme] || {}, styleDefault);
}