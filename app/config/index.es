
import merge from 'merge';

const config = {
  port: 3333,
  gaTrackingCode: 'UA-XXXXXX-XX'
};

if (process.env.NODE_ENV === 'production') {
  merge(config, {
    gaTrackingCode: 'UA-491601-13'
  });
}

export default config;