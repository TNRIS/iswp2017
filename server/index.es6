import Hapi from "hapi";

const server = new Hapi.Server();
server.connection({port: 3333});

server.start(() => {
  console.log(`Server running at ${server.info.uri}`);
});
