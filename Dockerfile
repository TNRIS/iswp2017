FROM node:0.12

ENV NODE_ENV production

RUN npm install -g babel@5

WORKDIR /usr/src/iswp2017

ADD package.json /usr/src/iswp2017/package.json
RUN npm install --production

ADD webpack.config.js /usr/src/iswp2017/webpack.config.js
ADD app /usr/src/iswp2017/app
RUN npm run webpack

EXPOSE 3333

ENTRYPOINT ["npm", "run", "start"]