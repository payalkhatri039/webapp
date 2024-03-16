#!/bin/bash

curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh

sudo bash add-google-cloud-ops-agent-repo.sh --also-install

sudo vi /etc/google-cloud-ops-agent/logConfig.yaml

sudo systemctl restart google-cloud-ops-agent

echo "start sleep"

sleep 10m




