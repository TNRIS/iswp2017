
import R from 'ramda';
import Boom from 'boom';

function isEmptyObj(o) {
  if (!o) { return true; }
  return R.isEmpty(R.keys(o));
}

function handleApiError(reply) {
  return (err) => {
    console.error(err);
    reply(Boom.badImplementation());
  };
}

export default {
  isEmptyObj,
  handleApiError
};