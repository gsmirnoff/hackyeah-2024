# How to setup the project

1. 'lambdas-hackyeah' bucket is hardcoded. You have to create it manually and update cloudformation.template and upload_to_s3.sh scripts with proper name.
2. Run build.sh script to build the project. It will create a zip file with the code and necessary dependencies.
3. Run upload_to_s3.sh script to upload packaged code to the S3 bucket (both transcribed and comprehended functions).
4. Run cloudformation.sh script to create stack
5. Add manually triggers to 'transcribed' and 'comprehended' buckets.