#!/bin/bash

## Init vars
CONF_TMPL=/etc/nginx/nginx.conf.txt
PROXY_CONF_FILE=/etc/nginx/conf.d/site.conf
EMAIL_ARG="--register-unsafely-without-email"
ADD_SERVER_NAME=""
ADD_PROXY_API=""
ADD_PROXY_STATS_API=""
CACHE_CONF=""

# do not forget to escape proxy vars (else envsubst removes them)
read -r -d '' ADD_PROXY_API_CONF <<EOM
    location ^~ /api {
         proxy_set_header        Host \$host;
         proxy_set_header        X-Real-IP \$remote_addr;
         proxy_set_header        X-Forwarded-For \$proxy_add_x_forwarded_for;
         proxy_set_header        X-Forwarded-Proto \$scheme;
         proxy_pass              ${PROXY_API_ENDPOINT};
         proxy_read_timeout      300;
         proxy_send_timeout      300;
         client_max_body_size    200M;

         # WebSocket support
         proxy_http_version 1.1;
         proxy_set_header Upgrade \$http_upgrade;
         proxy_set_header Connection "Upgrade";
    }
EOM

# do not forget to escape proxy vars (else envsubst removes them)
read -r -d '' ADD_PROXY_STATS_API_CONF <<EOM
    location ^~ /stats/api {
        proxy_set_header        Host \$host;
        proxy_set_header        X-Real-IP \$remote_addr;
        proxy_set_header        X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto \$scheme;
        proxy_pass              ${PROXY_STATS_ENDPOINT};
        proxy_read_timeout      90;
        proxy_send_timeout      90;
    }
EOM

read -r -d '' CACHE_CONFIGURATION <<EOM
    gzip on;
    gzip_disable "msie6";
    gzip_comp_level 6;
    gzip_min_length 1100;
    gzip_buffers 16 8k;
    gzip_proxied no-cache no-store private expired auth;
    gzip_types
        text/plain
        text/css
        text/js
        text/xml
        text/javascript
        application/javascript
        application/x-javascript
        application/json
        application/xml
        application/rss+xml
        image/svg+xml/javascript;


    # Enable cache for media: images, icons, video, etc
    location ~* \.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|mp3|ogg|ogv|webm|htc|woff2|woff)$ {
        expires 1M;
        add_header Cache-Control "max-age=2629746, public";
    }
EOM

## Create Nginx configuration ##
if [ -f "$PROXY_CONF_FILE" ]; then
    echo "Nginx configuration already exists: $PROXY_CONF_FILE "
else
    echo "Creating Nginx configuration: $PROXY_CONF_FILE"

    [ ! -z ${SERVER_NAME+x} ] && export ADD_SERVER_NAME="server_name ${SERVER_NAME}";
    [ ! -z ${PROXY_API_ENDPOINT+x} ] && export ADD_PROXY_API=$(echo "$ADD_PROXY_API_CONF");
    [ ! -z ${PROXY_STATS_ENDPOINT+x} ] && export ADD_PROXY_STATS_API=$(echo "$ADD_PROXY_STATS_API_CONF");
    if [ "$ENABLE_SSL" = "TRUE" ]; then export CACHE_CONF=$(echo "$CACHE_CONFIGURATION"); fi
    envsubst '${ADD_SERVER_NAME} ${ADD_PROXY_API} ${ADD_PROXY_STATS_API} ${CACHE_CONF}' < $CONF_TMPL > $PROXY_CONF_FILE

    rm /etc/nginx/conf.d/default.conf || echo "File '/etc/nginx/conf.d/default.conf' already deleted. OK"
    nginx -t
    cat $PROXY_CONF_FILE
    nginx -s reload

    if [ ! "$ENABLE_SSL" == "TRUE" ]; then
        echo "Simple Configuration"
    else
        echo "Using SSL Configuration"

        if [ ! -z ${SSL_EMAIL+x} ]; then
            EMAIL_ARG="-m $SSL_EMAIL"
        fi

        ((certbot install --cert-name $SERVER_NAME || certbot --nginx -d $SERVER_NAME --non-interactive --agree-tos $EMAIL_ARG) && nginx -t && cat $PROXY_CONF_FILE && nginx -s reload) &

    fi
fi
