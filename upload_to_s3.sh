#!/bin/bash
set -x
lambda_bucket=$(aws s3 ls | grep lambdas | cut -d " " -f 3)

# upload transcribe.zip to S3 bucket
aws s3 cp build/transcribe.zip s3://${lambda_bucket}/transcribe.zip

# upload comprehend.zip to S3 bucket
aws s3 cp build/comprehend.zip s3://${lambda_bucket}/comprehend.zip