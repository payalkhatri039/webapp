#!/bin/bash

sudo mkdir -p /var/log/webapp_logs

cd /var/log/ || exit

sudo touch /var/log/webapp_logs/webappLog.log

sudo chown csye6225:csye6225 webapp_logs -R 

cd && curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh

cd  && sudo bash add-google-cloud-ops-agent-repo.sh --also-install

sudo cp /tmp/config.yaml /etc/google-cloud-ops-agent/

sudo systemctl restart google-cloud-ops-agent

sleep 10m




