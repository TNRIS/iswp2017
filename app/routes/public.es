
import path from 'path';

export default [
  {
    method: 'GET',
    path: '/static/{param*}',
    handler: {
      directory: {
        path: path.normalize(__dirname + '../../public/static/')
      }
    }
  },
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: path.normalize(__dirname + '../../public/dist/')
      }
    }
  }
];