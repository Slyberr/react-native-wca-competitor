#!/bin/bash

set -e

#Loading env file.
ENV_FILE="~/Documents/git-projects/competitor_viewer/server/scripts/.env"

if [-f "$ENV_FILE"]; then
   set -o allexport
   source "$ENV_FILE"
   set +o allexport
else
    echo "ERROR ❌: the .env file is unreachable ! Name : $ENV_FILE"
    exit 1
fi

echo "⬇️ Downloading latest WCA_DATA..."

curl -L  https://www.worldcubeassociation.org/export/results/v2/sql -o wca_data.sql.zip

echo "Reset Database..."

mysql -u "$LOGIN" -p"$MDP_USER" 
