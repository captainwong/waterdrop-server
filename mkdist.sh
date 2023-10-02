#!/bin/bash

set -e

yarn build
rm -rf waterdrop-server-dist/
mkdir -p waterdrop-server-dist/
cp -r dist waterdrop-server-dist/
cp .env.captainwong.cn waterdrop-server-dist/.env
cp package.json waterdrop-server-dist/
cp yarn.lock waterdrop-server-dist/
rm -f waterdrop-server-dist.tar.gz
tar -zcvf waterdrop-server-dist.tar.gz waterdrop-server-dist/
scp ./waterdrop-server-dist.tar.gz root@hbwechatserver.com:/var/www/waterdrop-server-dist.tar.gz
ssh -t root@hbwechatserver.com "cd /var/www && rm -rf waterdrop-server-dist && tar -zxvf waterdrop-server-dist.tar.gz && cd waterdrop-server-dist && yarn install && cd .. && tar -zcvf waterdrop-server-dist.tar.gz waterdrop-server-dist/ && scp ./waterdrop-server-dist.tar.gz root@captainwong.cn:/var/www/waterdrop-server-dist.tar.gz"
ssh -t root@captainwong.cn "pm2 stop main && cd /var/www && rm -rf waterdrop-server-dist && tar -zxvf waterdrop-server-dist.tar.gz && cd waterdrop-server-dist && pm2 start main"

# pm2 restart waterdrop-server