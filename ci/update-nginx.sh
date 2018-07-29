#! /bin/bash

cp conf/nginx /etc/nginx/sites-enabled/testing-streaming
systemctl restart nginx
