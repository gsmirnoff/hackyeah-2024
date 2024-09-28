mkdir -p build
lambda_bucket=$(aws s3 ls | grep lambdas | cut -d " " -f 3)
timestamp=$(date +%s)

cd lambda/transcribe && zip -r ../../build/transcribe.zip . && cd ../../

sed -i "s/TranscribeFnFilename: ".*"$/TranscribeFnFilename: \"transcribe-${timestamp}.zip\"/g" cloudformation.template

aws s3 cp build/transcribe.zip s3://${lambda_bucket}/transcribe-${timestamp}.zip