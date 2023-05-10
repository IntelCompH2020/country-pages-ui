### Install and Build ###
FROM node:16 AS build

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install
COPY . .
ARG configuration=prod
RUN npm run build:$configuration


### Create Container ###
FROM nginx:alpine

COPY --from=build /usr/src/app/dist/country-pages-ui /usr/share/nginx/html
COPY nginx.conf.txt /etc/nginx/nginx.conf.txt

COPY 80-nginx-configure-site.sh /docker-entrypoint.d/80-nginx-configure-site.sh
COPY 90-renew-ssl.sh /docker-entrypoint.d/90-renew-ssl.sh

RUN apk update && apk add bash && apk add certbot-nginx
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

ENTRYPOINT ["/bin/bash", "-c", "/docker-entrypoint.sh nginx"]
CMD ["/bin/bash", "-c", "'while :; do sleep 6h & wait $${!}; nginx -s reload; done &'"]
EXPOSE 80
