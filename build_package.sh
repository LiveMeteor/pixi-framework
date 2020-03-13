#!/usr/bin/env bash

# clear project
rm -rf ./release/*

# build framework
tsc -p ./tsconfig.fw.json 
mv ./release/fw.min.js ./lib/
mv ./release/fw.min.js.map ./lib/
mkdir ./typings/fw
mv ./release/fw.min.d.ts ./typings/fw/index.d.ts
mv ./src/fw ./

# build app project
python3 str_replace.py './src/GameAPI.ts' '///' '// /'
tsc -p ./tsconfig.release.json
# uglifyjs release/js/fishing.min.js -o release/js/fishing.min.js
mv ./fw ./src/
rm -rf ./typings/fw
python3 str_replace.py './src/GameAPI.ts' '// /' '///'

# copy resources
cp ./template/index.html ./release/
cp ./template/index.css ./release/
cp -R ./dist/img ./release/
cp -R ./dist/sounds ./release/
cp ./template/main.js ./release/js/

# copy to target project
fe_prog_path=../../yosemite-fe/game/
if [ ! -d "${fe_prog_path}fishing" ]; then
    mkdir ${fe_prog_path}fishing
else
    rm -rf ${fe_prog_path}fishing/*
fi
cp -rf ./release/* ${fe_prog_path}fishing/
cp -f ./lib/fw.min* ${fe_prog_path}lib/

record_prog_path=../../yosemite-record/game/
if [ ! -d "${record_prog_path}fishing" ]; then
    mkdir ${record_prog_path}fishing
else
    rm -rf ${record_prog_path}fishing/*
fi
cp -rf ./release/* ${record_prog_path}fishing/
cp -f ./lib/fw.min* ${record_prog_path}lib/

echo "Publish Complete."
read
exit 0



