import os
import boto3
import json


def lambda_handler(event, context):
    s3_client = boto3.client('s3')
    comprehend_client = boto3.client('comprehend')

    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    output_bucket_name = os.environ['OUTPUT_BUCKET_NAME']
    output_file_name = key + '-comprehended.json'

    # Get the document from S3
    s3_response = s3_client.get_object(Bucket=bucket, Key=key)
    document_content = s3_response['Body'].read().decode('utf-8')

    # Parse the JSON document
    document = json.loads(document_content)

    # Extract the transcribed text
    transcribed_text = document['results']['transcripts'][0]['transcript']

    # Use AWS Comprehend to detect entities in the transcribed text
    try:
        print(f"Comprehend job started: {key}")

        comprehend_response = comprehend_client.detect_entities(Text=transcribed_text, LanguageCode='en')

        print(f"Comprehend job finished: {key}")
    except Exception as e:
        print(f"Error starting comprehend job: {str(e)}")
        return {
            'statusCode': 500,
            'body': f"Error starting comprehend job: {str(e)}"
        }

    # Write the entities detected in the transcribed text to a JSON file
    with open('/tmp/' + output_file_name, 'w') as outfile:
        json.dump(comprehend_response, outfile)

    # Upload the JSON file to S3
    try:
        s3_client.upload_file('/tmp/' + output_file_name, output_bucket_name, output_file_name)
    except Exception as e:
        print(f"Error writing to bucket comprehend response: {str(e)}")
        return {
            'statusCode': 500,
            'body': f"Error writing to bucket comprehend response: {str(e)}"
        }

    return {
        'statusCode': 200,
        'body': comprehend_response
    }