#!/bin/bash

helpFunction()
{
   echo "Usage: ./deploy.sh --project-id [YOUR GCLOUD PROJECT ID]"
   exit 0
}

while test $# -gt 0; do
           case "$1" in
                --project-id)
                    shift
                    project_id=$1
                    shift
                    ;;
                *)
                   echo "$1 is not a recognized flag!"
                   return 1;
                   ;;
          esac
  done  

if [[ -z "$project_id" ]];
then
   helpFunction
fi
gcloud config set project $project_id
gcloud builds submit --tag gcr.io/$project_id/ft-builder
gcloud run deploy ft-builder --image gcr.io/$project_id/ft-builder --platform managed --memory 4Gi --allow-unauthenticated --set-env-vars="_PROJECT_ID=$project_id" --region=australia-southeast1