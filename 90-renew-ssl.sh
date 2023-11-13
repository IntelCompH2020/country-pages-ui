#!/bin/bash

# renew SSL loop
while :; do sleep 12h & wait ${!}; if [ $ENABLE_SSL = "TRUE" ]; then certbot renew &> /etc/letsencrypt/certbot-renew.latest & fi done &
