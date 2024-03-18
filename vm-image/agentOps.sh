#!/bin/bash

sudo mkdir -p /var/logs/webapp_logs

cd /var/logs/ || exit

sudo chown csye6225:csye6225 webapp_logs -R 

cd && curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh

cd  && sudo bash add-google-cloud-ops-agent-repo.sh --also-install

sudo cp /tmp/config.yaml /etc/google-cloud-ops-agent/

sudo systemctl restart google-cloud-ops-agent

echo "start sleep"

sleep 10m




