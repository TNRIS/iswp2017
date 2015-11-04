FROM node:0.12

ENV NODE_ENV production

RUN npm install -g babel@5

WORKDIR /usr/src/iswp2017

ADD package.json package.json
RUN npm install --production

ADD webpack.config.js webpack.config.js
ADD app app
RUN npm run webpack

EXPOSE 3333

ENTRYPOINT ["npm", "run", "-dddd", "start"]