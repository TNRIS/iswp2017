import R from 'ramda';
import demands from './demands';

export default R.reduce(R.concat, [], [demands]);
