# Quick architecture overview

This project consists of frontend which allows to upload video files and process them in order to extract text information and process it with defined rule.
Frontend is written in React.
Frontend communicates with two services:
- AWS S3 buckets (video upload for transcription, transcript and text analysis data fetching)
- OpenAI API (additional text analysis)

Transcription and text analysis done by two AWS Lambda functions:
- transcribe: transcribes video files using AWS Transcribe and saves transcript to S3 bucket
  - triggered when video file is uploaded to 'source' bucket
- comprehend: analyzes text data using python library textstat and saves results to S3 bucket
  - triggered when transcript file is uploaded to 'transcribed' bucket

# How to setup the project


1. 'lambdas-hackyeah' bucket is used for storing lambda code. Name is hardcode. You have to create it manually and update cloudformation.template and upload_to_s3.sh scripts with proper name.
2. Run build.sh script to build the project. It will create a zip file with the code and necessary dependencies.
3. Run upload_to_s3.sh script to upload packaged code to the S3 bucket (lambdas-hackyeah mentioned above) (both transcribed and comprehended functions).
4. Run cloudformation.sh script to complete stack (remaining bucket, IAM policies and lambda functions).
5. Add manually triggers to 'source' and 'transcribed' buckets.

NOTE: for running build.sh, upload_to_s3.sh scripts you need to have installed AWS CLI and configured it with proper credentials.
NOTE: in order to use OpenAI API you need to have an account and API key. You have to provide it with OPENAI_API_KEY environment variable for frontend. 