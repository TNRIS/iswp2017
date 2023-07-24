FROM node:8

#Debian repositories were moved.
RUN sed -i -e 's/deb.debian.org/archive.debian.org/g' \
           -e 's|security.debian.org|archive.debian.org/|g' \
           -e '/stretch-updates/d' /etc/apt/sources.list

# update debian
RUN apt-get update

# set NODE_ENV to staging
ENV NODE_ENV production

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
