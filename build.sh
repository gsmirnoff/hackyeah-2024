mkdir -p build
lambda_bucket=$(aws s3 ls | grep lambdas | cut -d " " -f 3)
timestamp=$(date +%s)

# prepare transcribe lambda package
cd lambda/transcribe && zip -r ../../build/transcribe.zip . && cd ../../

sed -i "s/TranscribeFnFilename: ".*"$/TranscribeFnFilename: \"transcribe-${timestamp}.zip\"/g" cloudformation.template

aws s3 cp build/transcribe.zip s3://${lambda_bucket}/transcribe-${timestamp}.zip

# prepare comprehend lambda package
cd lambda/comprehend && zip -r ../../build/comprehend.zip . && cd ../../

sed -i "s/ComprehendFnFilename: ".*"$/ComprehendFnFilename: \"comprehend-${timestamp}.zip\"/g" cloudformation.template

aws s3 cp build/comprehend.zip s3://${lambda_bucket}/comprehend-${timestamp}.zip