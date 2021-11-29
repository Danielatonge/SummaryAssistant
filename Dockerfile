ARG APP_HOME="/usr/share/nginx/html"

FROM node:14-alpine as dependency-image

WORKDIR /build

COPY ./package.json ./package-lock.json ./
RUN npm ci


FROM dependency-image as compile-image

WORKDIR /build

COPY ./public ./public
COPY ./src  ./src
COPY \
    ./server.js \
    ./.browserslistrc \
    ./.eslintrc.js \
    ./static.json \
    ./vue.config.js \
    ./
RUN npm run build


FROM nginx:1.21-alpine as runtime-image
ARG APP_HOME

ENV APP_HOME=${APP_HOME}

RUN mkdir -p ${APP_HOME} && \
    \
    rm -rf ${APP_HOME:?}/*

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=compile-image /build/dist ${APP_HOME}

WORKDIR ${APP_HOME}

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 8080

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
