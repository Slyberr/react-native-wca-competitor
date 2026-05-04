#!/bin/bash

set -e

#Def text colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' 

echo_color() {
    local color="$1"
    local message="$2"
    echo -e "${color}${message}${NC}"
}

#Check env file
if [ -f "../.env" ]; then
   set -o allexport
   source "../.env"
   set +o allexport
else
    echo_color "$RED" "ERROR ❌: the .env file is unreachable  !  (Please execute the script IN the folder) Name : $ENV_FILE"
    exit 1
fi

echo_color "$BLUE" "⬇️  Downloading the latest wca's data..."

curl -L  https://www.worldcubeassociation.org/export/results/v2/sql -o wca_data.zip

echo_color  "$BLUE" "Clear Database..."

mysql -u "$LOGIN" -p"$MDP_USER" -e "
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME;"

echo_color "$BLUE" "Unzip wca_data"

if [ -f "wca_data.zip" ]; then
    unzip -o "wca_data.zip" -d wca_data
    cd wca_data/
else
    echo_color  "$RED" "ERROR ❌: the ZIP downloaded is unreachable !"
    exit 1
fi

if [ ! -f "WCA_export.sql" ]; then
    echo_color "$RED""ERROR ❌: 'WCA_export.sql was not found !"
    exit 1
fi

echo_color  "$BLUE" "Populate database (this operation may take few minutes...)"

mysql -u "$LOGIN" -p"$MDP_USER" "$DB_NAME" < "WCA_export.sql"

echo_color "$GREEN" "OK !"

echo_color "$BLUE" "Creating tables and indexs for performance..."

mysql -u "$LOGIN" -p"$MDP_USER" -e "

USE wca_data;
CREATE OR REPLACE TABLE geo_by_person as (SELECT p.wca_id,con.id as continent_id,cy.id as country_id  FROM persons p, countries cy, continents con
WHERE p.country_id = cy.id
AND cy.continent_id = con.id);

CREATE INDEX idx_geo_person ON geo_by_person(wca_id);
CREATE INDEX idx_ranks_single ON ranks_single(person_id);
CREATE INDEX idx_ranks_average ON ranks_average(person_id);


CREATE OR REPLACE TABLE ranks_by_geo AS
    (SELECT count(*) as total,p.country_id,rs.event_id,'single' 
        FROM geo_by_person p, ranks_single rs
        WHERE rs.person_id = p.wca_id
        GROUP BY p.country_id,rs.event_id)
    UNION
    (SELECT count(*) as total,p.country_id,ra.event_id,'average' 
        FROM geo_by_person p, ranks_average ra
        WHERE ra.person_id = p.wca_id
        GROUP BY p.country_id,ra.event_id);

SHOW TABLES;"

cd ..

rm -d -r wca_data/
rm wca_data.zip
echo_color "$GREEN" "✅ Script success and folder cleaned !"
