#!/bin/sh
# Build script
# set -o errexit
e () {
    echo $( echo ${1} | jq ".${2}" | sed 's/\"//g')
}
m=$(./src/app/metadata.sh)

org=$(e "${m}" "org")
hubuser=$(e "${m}" "hubuser")
name=$(e "${m}" "name")
version=$(e "${m}" "version")

artifactLabel=${ARTIFACT_LABEL:-bronze}
withCredentials([string(credentialsId: 'docker-pwd', variable: 'dockerhubpwd')]) {
docker login -u "${hubuser}" -p ${dockerhubpwd}"
}
docker push ${org}/${name}:${version}-${artifactLabel}
docker logout
