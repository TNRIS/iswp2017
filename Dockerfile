FROM node:8

# update debian
RUN apt-get update

# set NODE_ENV to staging
ENV NODE_ENV staging

# install babel
RUN yarn add --save-dev \
    babel-cli \
    babel-preset-env \
    babel-preset-es2015 \
    babel-preset-react \
    babel-plugin-transform-class-properties

# chdir into /usr/src/iswp2017
WORKDIR /usr/src/iswp2017

# copy app build dir to image
ADD src/ .

# install production dependencies
RUN yarn install --production

# run webpack
RUN yarn run webpack

# set default container command
ENTRYPOINT ["yarn", "run", "start"]
